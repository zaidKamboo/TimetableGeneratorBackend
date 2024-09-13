const { isLoggedIn } = require("../middlewares/user_middlewares");
const {
    isAuthorized,
    isOwner,
} = require("../middlewares/timetable_middlewares");
const {
    getTimetablesController,
    getUserTimetablesController,
    getTimetableController,
    getTimetableByCourseAndClassAndDeptName,
    editTimetableController,
    createTimetableController,
    addCollaboratorsController,
    deleteTimetableController,
    getCollaboratorsController,
    removeCollaboratorController,
} = require("../controllers/timetable_controllers");

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
