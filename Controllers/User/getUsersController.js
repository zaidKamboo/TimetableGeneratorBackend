const User = require("../../Models/User");

const getUsersController = async (req, res) => {
    try {
        const users = await User.find({});
        const totalUsers = users.length;
        const activeUsers = users.filter((user) => user.isActive).length;
        const inactiveUsers = totalUsers - activeUsers;

        return res.status(200).json({
            users,
            totalUsers,
            activeUsers,
            inactiveUsers,
            message: "Fetched details successfully.",
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

module.exports = getUsersController;
