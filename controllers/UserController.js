const User = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("../authorization/jwt");

const register = async (req, res) => {
    let userBody = req.body;

    if (!userBody.name || !userBody.lastName || !userBody.email || !userBody.username || !userBody.password || !userBody.category) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let userData = {
        name: userBody.name,
        lastName: userBody.lastName,
        email: userBody.email,
        username: userBody.username,
        password: userBody.password,
        category: userBody.category
    }

    try {
        const userAlreadyExist = await User.find({ $or: [{ username: userData.username }, { email: userData.email }] });

        if (userAlreadyExist.length >= 1) {
            return res.status(400).json({
                "message": "El usuario ya existe"
            });
        }

        let pwd = await bcrypt.hash(userData.password, 10);
        userData.password = pwd;

        let user_to_save = new User(userData);

        user_to_save.save().then(userStored => {
            return res.status(200).json({
                "user": userStored
            });
        }).catch(() => {
            return res.status(404).json({
                "message": "Error while saving user"
            });
        });
    } catch {
        return res.status(500).json({
            "message": "Error while finding user duplicate"
        });
    }
}

const login = (req, res) => {
    let userBody = req.body;

    if (!userBody.username || !userBody.password) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    User.findOne({ username: userBody.username }).then(user => {
        if (!user) {
            return res.status(400).json({
                "message": "Usuario no existe"
            });
        }

        let pwd = bcrypt.compareSync(userBody.password, user.password);

        if (!pwd) {
            return res.status(400).json({
                "message": "Contraseña incorrecta"
            });
        }

        const token = jwt.createToken(user);

        return res.status(200).json({
            "role": user.role,
            token
        });

    }).catch(() => {
        return res.status(500).json({
            "message": "Error while finding user"
        });
    });
}

const myUser = (req, res) => {
    User.findById(req.user.id).then(user => {
        return res.status(200).json({
            user
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while finding user"
        });
    });
}

const update = async (req, res) => {
    let userBody = req.body;

    if (req.user.role == "Usuario") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    User.findOneAndUpdate({ _id: userBody._id }, userBody, { new: true }).then(userUpdated => {
        if (!userUpdated) {
            return res.status(404).json({
                "mensaje": "User not found"
            });
        }
        return res.status(200).send({
            "user": userUpdated
        });
    }).catch((e) => {
        return res.status(404).json({
            "mensaje": "Error while finding and updating user"
        });
    });
}

const deleteUser = (req, res) => {
    let userId = req.query.userId;

    if (req.user.role == "Usuario") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    User.findOneAndDelete({ _id: userId }).then(userDeleted => {
        if (!userDeleted) {
            return res.status(404).json({
                "message": "No user found"
            });
        }
        return res.status(200).json({
            "message": "User deleted successfully"
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while deleting user"
        });
    });
}

module.exports = {
    register,
    login,
    myUser,
    update,
    deleteUser
}