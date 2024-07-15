const Notification = require("../../Models/Notification");

const getNotificationsController = async (req, res) => {
    try {
        const userId = req.params.id;
        const notifications = await Notification.find({ userId });
        return res
            .status(200)
            .json({
                message: "Fetched user's notifications successfully.",
                notifications,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getNotificationsController;
