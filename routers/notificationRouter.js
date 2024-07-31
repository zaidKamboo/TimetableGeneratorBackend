const {
    markAsReadNotificationController,
    deleteNotificationController,
} = require("../Controllers/notificationControllers");
const { isLoggedIn } = require("../Middlewares/userMiddlewares");
const router = require("express").Router();

router.put("/markAsRead/:id", isLoggedIn, markAsReadNotificationController);
router.delete(
    "/deleteNotification/:id",
    isLoggedIn,
    deleteNotificationController
);
module.exports = router;
