const router = require("express").Router();
const { isLoggedIn } = require("../Middlewares/userMiddlewares");
const { uploadAvatarMiddleware } = require("../Middlewares/multermiddlewares");
const {
    getProfileController,
    addProfileController,
    updateProfileController,
    deleteProfileController,
} = require("../Controllers/profileControllers");

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
