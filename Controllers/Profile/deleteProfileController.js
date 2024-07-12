const Profile = require("../../Models/Profile");
const cloudinary = require("../../Configs/Cloudinary");

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

module.exports = deleteProfileController;
