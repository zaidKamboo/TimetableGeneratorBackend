const Message = require("../../Models/Message");
const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const timetableCreationTrend = require("../../Utilities/Analytics/timetableCreationTrend");
const timetableDistribution = require("../../Utilities/Analytics/timetableDistribution");

const getAnalyticsController = async (req, res) => {
    try {
        const timetablesCount = await Timetable.countDocuments();
        const messagesCount = await Message.countDocuments();
        const activeUsers = await User.countDocuments();
        const creationTrend = await timetableCreationTrend();
        const distribution = await timetableDistribution();

        const messagesDistribution = await Message.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const usersDistribution = await User.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const analyticsData = {
            timetablesCount,
            users: activeUsers,
            timetableCreationTrend: creationTrend,
            timetableDistribution: distribution,
            messagesCount,
            messagesDistribution: {
                dates: messagesDistribution.map((data) => data._id),
                counts: messagesDistribution.map((data) => data.count),
            },
            usersDistribution: {
                dates: usersDistribution.map((data) => data._id),
                counts: usersDistribution.map((data) => data.count),
            },
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
