const Setting = require("../../Models/Setting");

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

module.exports = getSettingAnalyticsController;
