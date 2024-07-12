const getUsersAndProfilesController = require("../Controllers/User/getUsersAndProfilesController");
const getUsersController = require("../Controllers/User/getUsersController");
const loginController = require("../Controllers/User/loginController");
const signupController = require("../Controllers/User/signupController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const router = require("express")?.Router();

router.post("/signUp", signupController);
router.post("/login", loginController);
router.get("/getUsers", getUsersController);
router.get("/getUsersAndProfiles", isLoggedIn, getUsersAndProfilesController);

module.exports = router;
