const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");
const {
    getDepartmentsController,
    addDepartmentController,
} = require("../controllers/department_controllers");

const router = require("express").Router();

router.get("/getDepartments", isLoggedIn, getDepartmentsController);
router.post("/addDepartment", isLoggedIn, isAdmin, addDepartmentController);

module.exports = router;
