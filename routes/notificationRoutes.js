const deleteNotificationController = require("../Controllers/Notification/deleteNotificationController");
const markAsReadNotificationController = require("../Controllers/Notification/markAsReadNotificationController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const router = require("express").Router();

router.put("/markAsRead/:id", isLoggedIn, markAsReadNotificationController);
router.delete(
    "/deleteNotification/:id",
    isLoggedIn,
    deleteNotificationController
);
module.exports = router;
