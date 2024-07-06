const Settings = require("../../Models/Settings");

const addSettingController = async (req, res) => {
    const {
        user,
        name,
        email,
        darkMode,
        language,
        emailNotifications,
        smsNotifications,
    } = req.body;

    try {
        let settings = await Settings.findOne({ user });

        if (settings) {
            return res
                .status(400)
                .json({ message: "Settings already exist for this user" });
        }

        settings = await Settings.create({
            user,
            name,
            email,
            darkMode,
            language,
            emailNotifications,
            smsNotifications,
        });

        return res.status(201).json({
            message: "Settings added successfully",
            settings,
        });
    } catch (error) {
        console.error("Error adding settings:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = addSettingController;
