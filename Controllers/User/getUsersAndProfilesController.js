const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const getUsersAndProfilesController = async (_, res) => {
    try {
        const users = await User.find({}, "name email _id").lean();
        const profilePromises = users.map((user) =>
            Profile.findOne({ user: user._id }, "avatar").lean()
        );
        const profiles = await Promise.all(profilePromises);

        const usersAndProfiles = users.map((user, index) => ({
            ...user,
            avatar: profiles[index]?.avatar || null,
        }));

        return res.status(200).json({ users: usersAndProfiles });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = getUsersAndProfilesController;
