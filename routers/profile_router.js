const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/user_middlewares");
const { uploadAvatarMiddleware } = require("../middlewares/multer_middlewares");
const {
    getProfileController,
    addProfileController,
    updateProfileController,
    deleteProfileController,
} = require("../controllers/profile_controllers");

router.get("/getProfile/:id", isLoggedIn, getProfileController);
router.post(
    "/addProfile",
    isLoggedIn,
    uploadAvatarMiddleware,
    addProfileController
);
router.put(
    "/updateProfile/:id",
    isLoggedIn,
    uploadAvatarMiddleware,
    updateProfileController
);

router.delete("/deleteProfile/:id", isLoggedIn, deleteProfileController);
module.exports = router;
