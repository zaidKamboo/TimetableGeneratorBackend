const Setting = require("../../Models/Setting");

const validateFields = (
    user,
    name,
    email,
    darkMode,
    language,
    emailNotifications,
    smsNotifications
) => {
    const errors = {};
    if (!user) errors.user = 'Field "user" is required.';
    if (!name) errors.name = 'Field "name" is required.';
    if (!email) errors.email = 'Field "email" is required.';
    if (darkMode === undefined)
        errors.darkMode = 'Field "darkMode" is required.';
    if (!language) errors.language = 'Field "language" is required.';
    if (emailNotifications === undefined)
        errors.emailNotifications = 'Field "emailNotifications" is required.';
    if (smsNotifications === undefined)
        errors.smsNotifications = 'Field "smsNotifications" is required.';
    return errors;
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

        const errors = validateFields(
            user,
            name,
            email,
            darkMode,
            language,
            emailNotifications,
            smsNotifications
        );

        if (Object.keys(errors).length > 0) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors });
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

module.exports = addOrEditSettingController;
