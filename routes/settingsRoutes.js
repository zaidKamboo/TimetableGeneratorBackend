const addOrEditSettingController = require("../Controllers/Settings/addOrEditSettingController");
const getSettingController = require("../Controllers/Settings/getSettingController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const router = require("express").Router();

router.post("/addOrEditSetting", isLoggedIn, addOrEditSettingController);
router.get("/getSetting/:id", isLoggedIn, getSettingController);

module.exports = router;
