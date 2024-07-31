const {
    signupController,
    loginController,
    getUsersController,
    getNotificationsController,
    getUsersAndProfilesController,
    logoutController,
} = require("../Controllers/userControllers");
const { isLoggedIn, isAdmin } = require("../Middlewares/userMiddlewares");

const router = require("express").Router();

router.post("/signUp", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/getUsers", isLoggedIn, isAdmin, getUsersController);
router.get("/getUsersAndProfiles", isLoggedIn, getUsersAndProfilesController);
router.get("/getNotifications/:id", isLoggedIn, getNotificationsController);

module.exports = router;
