const addCollaboratorsController = require("../Controllers/Timetable/addColloboratorsController");
const createTimetableController = require("../Controllers/Timetable/createTimetableController");
const editTimetableController = require("../Controllers/Timetable/editTimetableController");
const getTimetableByCourseAndClassAndDeptName = require("../Controllers/Timetable/getTimetableByCourse&Class&DeptName");
const getTimetableController = require("../Controllers/Timetable/getTimetableController");
const getTimetablesController = require("../Controllers/Timetable/getTimetablesController");
const getUserTimetablesController = require("../Controllers/Timetable/getUserTimetablesController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const isAuthorized = require("../Middlewares/Timetable/isAuthorized");
const deleteTimetableController = require("../Controllers/Timetable/deleteTimetableController");
const getCollaboratorsController = require("../Controllers/Timetable/getCollaboratorsController");
const removeCollaboratorController = require("../Controllers/Timetable/removeCollaboratorController");
const isOwner = require("../Middlewares/Timetable/isOwner");

const router = require("express").Router();

router.get("/getTimetables", isLoggedIn, getTimetablesController);
router.get("/getTimetables/:id", isLoggedIn, getUserTimetablesController);
router.get("/getTimetable/:id", isLoggedIn, getTimetableController);
router.get(
    "/getTimetableByNames",
    isLoggedIn,
    getTimetableByCourseAndClassAndDeptName
);
router.put(
    "/editTimetable/:id",
    isLoggedIn,
    isAuthorized,
    editTimetableController
);
router.post("/createTimetable", isLoggedIn, createTimetableController);
router.post(
    "/addCollaborators/:id",
    isLoggedIn,
    isOwner,
    addCollaboratorsController
);

router.delete(
    "/deleteTimetable/:id",
    isLoggedIn,
    isOwner,
    deleteTimetableController
);

router.get(
    "/getCollaborators/:id",
    isLoggedIn,
    isAuthorized,
    getCollaboratorsController
);

router.delete(
    "/removeCollaborator/:id",
    isLoggedIn,
    isAuthorized,
    removeCollaboratorController
);

module.exports = router;
