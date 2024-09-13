const Profile = require("../models/profile");
const cloudinary = require("../configs/cloudinary");

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

const deleteProfileController = async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        if (profile?.avatar) {
            const avatarUrl = profile.avatar;
            const publicId = avatarUrl
                .split("/")
                .slice(-3)
                .join("/")
                .split(".")
                .slice(0, -1)
                .join(".");
            await cloudinary.uploader.destroy(publicId);
        }

        await Profile.findByIdAndDelete(id);
        return res
            .status(200)
            .json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.log(error.message, error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = {
    getProfileController,
    addProfileController,
    updateProfileController,
    deleteProfileController,
};
