const Profile = require("../../Models/Profile");

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
            message:"Fetched profiles details successfully.",
        });
    } catch (error) {
        console.error("Error fetching profile analytics:", error);
        res.status(500).json({ message: "Failed to fetch profile analytics" });
    }
};

module.exports = getProfileAnalyticsController;
