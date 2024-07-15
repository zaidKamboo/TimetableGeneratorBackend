const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const getUsersController = async (_, res) => {
    try {
        const users = await User.find().lean();

        return res.status(200).json({ users });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = getUsersController;
