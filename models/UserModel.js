const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "Usuario"
    },
    category: {
        type: String
    },
    verificationCode: {
        type: String
    }
});

module.exports = model("User", UserSchema, "users");