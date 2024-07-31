const Setting = require("../Models/Setting");

const validateFields = (
    user,
    name,
    email,
    darkMode,
    language,
    emailNotifications,
    smsNotifications
) => {
    let error = "";
    if (!user) error = 'Field "user" is required.';
    if (!name) error = 'Field "name" is required.';
    if (!email) error = 'Field "email" is required.';
    if (darkMode === undefined) error = 'Field "darkMode" is required.';
    if (!language) error = 'Field "language" is required.';
    if (emailNotifications === undefined)
        error = 'Field "emailNotifications" is required.';
    if (smsNotifications === undefined)
        error = 'Field "smsNotifications" is required.';
    return error;
};

const addOrEditSettingController = async (req, res) => {
    try {
        const {
            user,
            name,
            email,
            darkMode,
            language,
            emailNotifications,
            smsNotifications,
        } = req.body;

        const error = validateFields(
            user,
            name,
            email,
            darkMode,
            language,
            emailNotifications,
            smsNotifications
        );

        if (error.length > 0) {
            return res.status(400).json({ message: error });
        }

        const updatePayload = {
            name,
            email,
            darkMode,
            language,
            emailNotifications,
            smsNotifications,
        };
        let setting = await Setting.findOne({ user });
        if (!setting) {
            setting = await Setting.create({ ...updatePayload, user });
            return res.status(200).json({
                message: "Settings added successfully.",
                setting,
            });
        } else {
            setting = await Setting.findByIdAndUpdate(
                setting?._id,
                updatePayload
            );
            return res.status(200).json({
                message: "Settings updated successfully.",
                setting,
            });
        }
    } catch (error) {
        console.error("Error adding or updating settings:", error);
        return res.status(500).json({ message: error?.message, error });
    }
};

const getSettingController = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(404).json({ message: "Setting not found." });
        }
        const setting = await Setting.findOne({ user: req.user._id });
        return res
            .status(200)
            .json({ message: "Fetched setting successfully.", setting });
    } catch (error) {
        console.log(error, error?.message);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = { addOrEditSettingController, getSettingController };
