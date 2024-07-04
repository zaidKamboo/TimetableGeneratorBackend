const createTimetableController = require("../Controllers/Timetable/createTimetableController");
const getTimetablesController = require("../Controllers/Timetable/getTimetablesController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");

const router = require("express").Router();

router.get("/getTimetables", getTimetablesController);
router.post("/createTimetable", isLoggedIn, createTimetableController);

module.exports = router;
