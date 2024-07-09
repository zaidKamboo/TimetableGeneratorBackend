const router = require("express").Router();
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const getProfileController = require("../Controllers/Profile/getProfileController");

router.get("/getProfile/:id", isLoggedIn, getProfileController);

module.exports = router;
