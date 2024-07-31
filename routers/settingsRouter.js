const {
    addOrEditSettingController,
    getSettingController,
} = require("../Controllers/settingsControllers");
const { isLoggedIn } = require("../Middlewares/userMiddlewares");
const router = require("express").Router();

router.post("/addOrEditSetting", isLoggedIn, addOrEditSettingController);
router.get("/getSetting/:id", isLoggedIn, getSettingController);

module.exports = router;
