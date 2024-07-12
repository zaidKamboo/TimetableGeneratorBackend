const cloudinary = require("../../Configs/Cloudinary");
const Profile = require("../../Models/Profile");

const updateProfileController = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            fullName,
            email,
            timezone,
            timetableReminders,
            newsletterSubscribed,
        } = req.body;

        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        if (req.file && profile.avatar) {
            const avatarUrl = profile.avatar;
            const publicId = avatarUrl
                .split("/")
                .slice(-3)
                .join("/")
                .split(".")
                .slice(0, -1)
                .join(".");

            console.log("Deleting from Cloudinary:", publicId);

            const deletionResult = await cloudinary.uploader.destroy(publicId);
            console.log("Cloudinary Deletion Result:", deletionResult);
        }

        profile.fullName = fullName || profile.fullName;
        profile.email = email || profile.email;
        profile.timezone = timezone || profile.timezone;
        profile.notificationSettings = {
            timetableReminders:
                timetableReminders !== undefined
                    ? timetableReminders
                    : profile.notificationSettings.timetableReminders,
            newsletterSubscribed:
                newsletterSubscribed !== undefined
                    ? newsletterSubscribed
                    : profile.notificationSettings.newsletterSubscribed,
        };

        if (req.file) {
            profile.avatar = req.file.path;
        }

        await profile.save();

        res.status(200).json({
            message: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error("Update Profile Error: ", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = updateProfileController;
