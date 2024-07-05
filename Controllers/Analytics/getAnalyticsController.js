const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const timetableCreationTrend = require("../../Utilities/Analytics/timetableCreationTrend");
const timetableDistribution = require("../../Utilities/Analytics/timetableDistribution");

const getAnalyticsController = async (req, res) => {
    try {
        const timetableCount = await Timetable.countDocuments();
        const activeUsers = await User.countDocuments();
        const creationTrend = await timetableCreationTrend();
        const distribution = await timetableDistribution();

        const analyticsData = {
            timetableCount,
            users: activeUsers,
            timetableCreationTrend: creationTrend,
            timetableDistribution: distribution,
        };

        return res
            .status(200)
            .json({ analyticsData, message: "Fetched data successfully." });
    } catch (error) {
        console.log(error?.message, error);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getAnalyticsController;
