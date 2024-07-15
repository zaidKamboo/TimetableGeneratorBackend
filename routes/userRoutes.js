const getUsersAndProfilesController = require("../Controllers/User/getUsersAndProfilesController");
const getUsersController = require("../Controllers/User/getUsersController");
const loginController = require("../Controllers/User/loginController");
const signupController = require("../Controllers/User/signupController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const isAdmin = require("../Middlewares/User/isAdmin");
const getNotificationsController = require("../Controllers/User/getNotifications");

const router = require("express").Router();

router.post("/signUp", signupController);
router.post("/login", loginController);
router.get("/getUsers", isLoggedIn, isAdmin, getUsersController);
router.get("/getUsersAndProfiles", isLoggedIn, getUsersAndProfilesController);
router.get("/getNotifications/:id", isLoggedIn, getNotificationsController);

module.exports = router;
