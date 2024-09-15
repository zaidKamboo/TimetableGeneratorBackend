const router = require("express").Router();

const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");
const {
    addDepartmentController,
    deleteDepartmentController,
    editDepartmentController,
    getDepartmentsController,
    getDepartmentController,
} = require("../controllers/department_controllers");
const {
    uploadHodSignMiddleware,
} = require("../middlewares/multer_middlewares");

router.get("/getDepartments", isLoggedIn, getDepartmentsController);
router.get("/getDepartment/:id", isLoggedIn, isAdmin, getDepartmentController);
router.put(
    "/editDepartment/:id",
    isLoggedIn,
    isAdmin,
    uploadHodSignMiddleware,
    editDepartmentController
);
router.delete(
    "/deleteDepartment/:id",
    isLoggedIn,
    isAdmin,
    deleteDepartmentController
);
router.post(
    "/addDepartment",
    isLoggedIn,
    isAdmin,
    uploadHodSignMiddleware,
    addDepartmentController
);

module.exports = router;
