const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const check = require("../authorization/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/myUser", check.auth, UserController.myUser);
router.put("/", check.auth, UserController.update);
router.delete("/", check.auth, UserController.deleteUser);
router.post("/sendCode", UserController.sendCode);
router.post("/verifyCode", UserController.verifyCode);
router.put("/updatePassword", UserController.updatePassword);

module.exports = router;