const Setting = require("../../Models/Setting");

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

module.exports = getSettingController;
