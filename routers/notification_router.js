const {
    markAsReadNotificationController,
    deleteNotificationController,
} = require("../controllers/notification_controllers");
const { isLoggedIn } = require("../middlewares/user_middlewares");
const router = require("express").Router();

router.put("/markAsRead/:id", isLoggedIn, markAsReadNotificationController);
router.delete(
    "/deleteNotification/:id",
    isLoggedIn,
    deleteNotificationController
);
module.exports = router;
