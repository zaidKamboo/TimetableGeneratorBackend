const Message = require("../Models/Message");
const Profile = require("../Models/Profile");
const Setting = require("../Models/Setting");
const Testimonial = require("../Models/Testimonial");
const Timetable = require("../Models/Timetable");
const User = require("../Models/User");
const timetableCreationTrend = require("../Utilities/Analytics/timetableCreationTrend");
const timetableDistribution = require("../Utilities/Analytics/timetableDistribution");

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

const getProfileAnalyticsController = async (req, res) => {
    try {
        const profileCountByTimezone = await Profile.aggregate([
            {
                $group: {
                    _id: "$timezone",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    timezone: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ]);

        const avatarPresenceAnalysis = await Profile.aggregate([
            {
                $group: {
                    _id: null,
                    withAvatarCount: {
                        $sum: {
                            $cond: [{ $ifNull: ["$avatar", false] }, 1, 0],
                        },
                    },
                    withoutAvatarCount: {
                        $sum: { $cond: [{ $ifNull: ["$avatar", true] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);

        const notificationSettingsAnalysis = await Profile.aggregate([
            {
                $group: {
                    _id: null,
                    timetableRemindersCount: {
                        $sum: {
                            $cond: [
                                "$notificationSettings.timetableReminders",
                                1,
                                0,
                            ],
                        },
                    },
                    newsletterSubscribedCount: {
                        $sum: {
                            $cond: [
                                "$notificationSettings.newsletterSubscribed",
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]);

        return res.status(200).json({
            analytics: {
                profileCountByTimezone,
                avatarPresenceAnalysis: avatarPresenceAnalysis[0],
                notificationSettingsAnalysis: notificationSettingsAnalysis[0],
            },
            message: "Fetched profiles details successfully.",
        });
    } catch (error) {
        console.error("Error fetching profile analytics:", error);
        res.status(500).json({ message: "Failed to fetch profile analytics" });
    }
};
const getSettingAnalyticsController = async (_, res) => {
    try {
        const analyticsData = await Setting.aggregate([
            {
                $group: {
                    _id: null,
                    totalSettings: { $sum: 1 },
                    totalDarkModeEnabled: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$darkMode", true] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    totalLanguages: { $addToSet: "$language" },
                    totalEmailNotificationsEnabled: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$emailNotifications", true] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    totalSMSNotificationsEnabled: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$smsNotifications", true] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                },
            },
        ]);

        if (!analyticsData || analyticsData.length === 0) {
            return res.status(404).json({ error: "Analytics data not found" });
        }

        return res.status(200).json({
            analytics: analyticsData,
            message: "Fetched settings analytics successfully.",
        });
    } catch (error) {
        console.error("Error fetching setting analytics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getTestimonialsAnalyticsController = async (_, res) => {
    try {
        const testimonials = await Testimonial.find().populate("user", "name");
        const totalRatings = testimonials.reduce(
            (acc, curr) => acc + curr.rating,
            0
        );
        const averageTestimonialRating =
            testimonials.length > 0 ? totalRatings / testimonials.length : 0;

        const ratingsCounts = Array.from({ length: 5 }, () => 0);
        testimonials.forEach((testimonial) => {
            ratingsCounts[testimonial.rating - 1]++;
        });

        const testimonialsDistribution = {
            counts: ratingsCounts,
        };

        return res.status(200).json({
            analytics: {
                testimonials,
                averageTestimonialRating,
                testimonialsDistribution,
            },
            message: "Testimonials analytics fetched successfully.",
        });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({
            message: error?.message,
            error,
        });
    }
};
module.exports = {
    getAnalyticsController,
    getProfileAnalyticsController,
    getSettingAnalyticsController,
    getTestimonialsAnalyticsController,
};
