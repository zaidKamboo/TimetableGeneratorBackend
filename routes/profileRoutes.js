const router = require("express").Router();
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const getProfileController = require("../Controllers/Profile/getProfileController");
const uploadAvatarMiddleware = require("../Middlewares/Multer/uploadAvatar");
const addProfileController = require("../Controllers/Profile/addProfileController");
const updateProfileController = require("../Controllers/Profile/updateProfileController");
const deleteProfileController = require("../Controllers/Profile/deleteProfileController");

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
