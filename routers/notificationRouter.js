const {
    markAsReadNotificationController,
    deleteNotificationController,
} = require("../controllers/notificationControllers");
const { isLoggedIn } = require("../middlewares/userMiddlewares");
const router = require("express").Router();

router.put("/markAsRead/:id", isLoggedIn, markAsReadNotificationController);
router.delete(
    "/deleteNotification/:id",
    isLoggedIn,
    deleteNotificationController
);
module.exports = router;
