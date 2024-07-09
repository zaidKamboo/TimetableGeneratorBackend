const addOrEditSettingController = require("../Controllers/Settings/addOrEditSettingController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const router = require("express").Router();

router.post("/addOrEditSetting", isLoggedIn, addOrEditSettingController);

module.exports = router;
