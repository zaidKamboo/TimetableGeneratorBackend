const {
    getClassesController,
    addClassController,
    getClassController,
    editClassController,
    deleteClassController,
} = require("../controllers/class_controllers");
const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");

const router = require("express").Router();

router.get("/getClasses", isLoggedIn, getClassesController);
router.get("/getClass/:id", isLoggedIn, isAdmin, getClassController);
router.put("/editClass/:id", isLoggedIn, isAdmin, editClassController);
router.delete("/deleteClass/:id", isLoggedIn, isAdmin, deleteClassController);
router.post("/addClass", isLoggedIn, isAdmin, addClassController);

module.exports = router;
