const Notification = require("../../Models/Notification");

const createNotification = async (userId, message, type = "info") => {
    try {
        const notification = new Notification({ userId, message, type });
        await notification.save();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

module.exports = createNotification;
