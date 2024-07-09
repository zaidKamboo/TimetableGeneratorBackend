const Profile = require("../../Models/Profile");

const getProfileController = async (req, res) => {
    try {
        const user = req.params.id;
        if (user === "undefined") {
            return res
                .status(404)
                .json({ message: "Profile not found.", profile: {} });
        }
        const profile = await Profile.findOne({ user });
        if (profile === null) {
            return res.status(201).json({
                message: "Fetched User profile succesfully.",
                profile: {},
            });
        } else {
            return res.status(201).json({
                message: "Fetched User profile succesfully.",
                profile,
            });
        }
    } catch (error) {
        console.log(error?.message);
        return res.status(500).json({ message: error?.message });
    }
};

module.exports = getProfileController;
