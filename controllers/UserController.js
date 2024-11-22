const User = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("../authorization/jwt");

const registerUser = async (req, res) => {
    let userBody = req.body;

    if (!userBody.name || !userBody.lastName || !userBody.username || !userBody.password || !userBody.category) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let userData = {
        name: userBody.name,
        lastName: userBody.lastName,
        username: userBody.username,
        password: userBody.password,
        category: userBody.category
    }

    try {
        const userAlreadyExist = await User.find({ username: userData.username });

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

const registerAdmin = async (req, res) => {
    let userBody = req.body;

    if (!userBody.name || !userBody.lastName || !userBody.username || !userBody.password) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    let userData = {
        name: userBody.name,
        lastName: userBody.lastName,
        username: userBody.username,
        password: userBody.password,
        role: "Administrador",
        category: "Admin"
    }

    try {
        const userAlreadyExist = await User.find({ username: userData.username });

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

module.exports = {
    registerUser,
    registerAdmin,
    login,
    myUser
}