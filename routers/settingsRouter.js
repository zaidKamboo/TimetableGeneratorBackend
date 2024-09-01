const {
    addOrEditSettingController,
    getSettingController,
} = require("../controllers/settingsControllers");
const { isLoggedIn } = require("../middlewares/userMiddlewares");
const router = require("express").Router();

router.post("/addOrEditSetting", isLoggedIn, addOrEditSettingController);
router.get("/getSetting/:id", isLoggedIn, getSettingController);

module.exports = router;
