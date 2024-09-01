const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/userMiddlewares");
const { uploadAvatarMiddleware } = require("../middlewares/multermiddlewares");
const {
    getProfileController,
    addProfileController,
    updateProfileController,
    deleteProfileController,
} = require("../controllers/profileControllers");

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
