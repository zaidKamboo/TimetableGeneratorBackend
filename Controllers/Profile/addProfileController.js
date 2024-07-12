const Profile = require("../../Models/Profile");

const addProfileController = async (req, res) => {
    try {
        const {
            user,
            fullName,
            email,
            timezone,
            newsletterSubscribed,
            timetableReminders,
        } = req.body;
        if (!user)
            return res
                .status(400)
                .json({ message: "Field 'user' is required. " });
        if (!fullName)
            return res
                .status(400)
                .json({ message: "Field 'fullName' is required. " });
        if (!email)
            return res
                .status(400)
                .json({ message: "Field 'email' is required. " });
        if (!timezone)
            return res
                .status(400)
                .json({ message: "Field 'timezone' is required. " });

        let profile = await Profile.findOne({ user });
        if (profile?._id) {
            return res.status(400).json({ message: "Profile already exists." });
        }
        profile = await Profile.create({
            user,
            fullName,
            email,
            avatar: req.file.path,
            timezone,
            notificationSettings: { newsletterSubscribed, timetableReminders },
        });
        return res.status(200).json({
            message: "Profile added successfully.",
            profile,
        });
    } catch (error) {
        console.error("Error adding profile:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = addProfileController;
