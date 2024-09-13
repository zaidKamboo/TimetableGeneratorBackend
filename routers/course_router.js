const {
    addCourseController,
    getCoursesController,
} = require("../controllers/course_controllers");
const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");

const router = require("express").Router();

router.post("/addCourse", isLoggedIn, isAdmin, addCourseController);
router.get("/getCourses", isLoggedIn, getCoursesController);

module.exports = router;
