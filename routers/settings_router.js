const {
    addOrEditSettingController,
    getSettingController,
} = require("../controllers/settings_controllers");
const { isLoggedIn } = require("../middlewares/user_middlewares");
const router = require("express").Router();

router.post("/addOrEditSetting", isLoggedIn, addOrEditSettingController);
router.get("/getSetting/:id", isLoggedIn, getSettingController);

module.exports = router;
