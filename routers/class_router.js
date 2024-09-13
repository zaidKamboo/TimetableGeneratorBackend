const {
    getClassesController,
    addClassController,
} = require("../controllers/class_controllers");
const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");

const router = require("express").Router();

router.get("/getClasses", isLoggedIn, getClassesController);
router.post("/addClass", isLoggedIn, isAdmin, addClassController);

module.exports = router;
