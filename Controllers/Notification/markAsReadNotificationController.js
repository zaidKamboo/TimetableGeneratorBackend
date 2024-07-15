const Notification = require("../../Models/Notification");

const markAsReadNotificationController = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({
            message: "Notification marked as read.",
            notification: updatedNotification,
        });
    } catch (error) {
        console.error("Error marking notification as viewed:", error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = markAsReadNotificationController;
