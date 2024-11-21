const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const check = require("../authorization/auth");

router.post("/post-user", UserController.registerUser);
router.post("/post-admin", UserController.registerAdmin);
router.post("/login", UserController.login);
router.get("/myUser", check.auth, UserController.myUser);

module.exports = router;