const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");

const check = require("../authorization/auth");

router.post("/post-user", check.auth, EventController.createFromUser);
router.post("/post-admin", check.auth, EventController.createFromAdmin);
router.delete("/", check.auth, EventController.deleteEvent);
router.put("/approve", check.auth, EventController.approveEvent);
router.get("/stand-by", check.auth, EventController.getEventsStandBy);
router.put("/", check.auth, EventController.update);
router.get("/getByDay", EventController.getEventsByDay);
router.get("/getByWeek", EventController.getEventsFromWeek);
router.get("/getByMonth", EventController.getEventsUntilMonth);

module.exports = router;