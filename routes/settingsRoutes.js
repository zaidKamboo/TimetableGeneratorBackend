const addSettingController = require("../Controllers/Settings/addSettingController");
const router = require("express").Router();

router.post("/addSetting", addSettingController);

module.exports = router;
