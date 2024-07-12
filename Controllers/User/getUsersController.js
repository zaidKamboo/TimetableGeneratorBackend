const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const getUsersAndProfilesController = async (_, res) => {
    try {
        const users = User.find();

        return res.status(200).json({ users: usersAndProfiles });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = getUsersAndProfilesController;
