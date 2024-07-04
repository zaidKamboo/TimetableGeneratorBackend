const loginController = require("../Controllers/User/loginController");
const signupController = require("../Controllers/User/signupController");
const router = require("express")?.Router();

router.post("/signUp", signupController);
router.post("/login", loginController);

module.exports = router;
