const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");

const check = require("../authorization/auth");

router.post("/post-user", check.auth, EventController.createFromUser);
router.post("/post-admin", check.auth, EventController.createFromAdmin);
router.delete("/", check.auth, EventController.deleteEvent);
router.put("/approve", check.auth, EventController.approveEvent);
router.get("/stand-by", check.auth, EventController.getEventsStandBy);

module.exports = router;