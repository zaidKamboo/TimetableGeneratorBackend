const Message = require("../../Models/Message");
const Profile = require("../../Models/Profile");
const Setting = require("../../Models/Setting");
const Testimonial = require("../../Models/Testimonial");
const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const timetableCreationTrend = require("../../Utilities/Analytics/timetableCreationTrend");
const timetableDistribution = require("../../Utilities/Analytics/timetableDistribution");

const getAnalyticsController = async (_, res) => {
    try {
        const timetablesCount = await Timetable.countDocuments();
        const messagesCount = await Message.countDocuments();
        const activeUsers = await User.countDocuments();
        const profilesCount = await Profile.countDocuments();
        const settingsCount = await Setting.countDocuments();
        const testimonialsCount = await Testimonial.countDocuments();
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

        const profilesDistribution = await Profile.aggregate([
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

        const settingsDistribution = await Setting.aggregate([
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

        const testimonialsDistribution = await Testimonial.aggregate([
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
            profilesCount,
            profilesDistribution: {
                dates: profilesDistribution.map((data) => data._id),
                counts: profilesDistribution.map((data) => data.count),
            },
            settingsCount,
            settingsDistribution: {
                dates: settingsDistribution.map((data) => data._id),
                counts: settingsDistribution.map((data) => data.count),
            },
            testimonialsCount,
            testimonialsDistribution: {
                dates: testimonialsDistribution.map((data) => data._id),
                counts: testimonialsDistribution.map((data) => data.count),
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
