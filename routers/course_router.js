const {
    addCourseController,
    getCoursesController,
    getCourseController,
    editCourseController,
    deleteCourseController,
} = require("../controllers/course_controllers");
const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");

const router = require("express").Router();

router.post("/addCourse", isLoggedIn, isAdmin, addCourseController);
router.get("/getCourses", isLoggedIn, getCoursesController);
router.get("/getCourse/:id", isLoggedIn, isAdmin, getCourseController);
router.put("/editCourse/:id", isLoggedIn, isAdmin, editCourseController);
router.delete("/deleteCourse/:id", isLoggedIn, isAdmin, deleteCourseController);

module.exports = router;
