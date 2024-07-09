const createTimetableController = require("../Controllers/Timetable/createTimetableController");
const editTimetableController = require("../Controllers/Timetable/editTimetableController");
const getTimetableByCourseAndClassAndDeptName = require("../Controllers/Timetable/getTimetableByCourse&Class&DeptName");
const getTimetableController = require("../Controllers/Timetable/getTimetableController");
const getTimetablesController = require("../Controllers/Timetable/getTimetablesController");
const getUserTimetablesController = require("../Controllers/Timetable/getUserTimetablesController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");

const router = require("express").Router();

router.get("/getTimetables", isLoggedIn, getTimetablesController);
router.get("/getTimetables/:id", isLoggedIn, getUserTimetablesController);
router.get("/getTimetable/:id", isLoggedIn, getTimetableController);
router.get(
    "/getTimetableByNames",
    isLoggedIn,
    getTimetableByCourseAndClassAndDeptName
);
router.put("/editTimetable/:id", isLoggedIn, editTimetableController);
router.post("/createTimetable", isLoggedIn, createTimetableController);

module.exports = router;
