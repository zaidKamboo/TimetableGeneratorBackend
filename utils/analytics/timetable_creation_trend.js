const Timetable = require("../../models/timetable");

const timetableCreationTrend = async () => {
    const trend = await Timetable.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
    ]);

    const formattedTrend = {};
    trend.forEach((item) => {
        const yearMonth = `${item._id.year}-${item._id.month}`;
        formattedTrend[yearMonth] = item.count;
    });

    return formattedTrend;
};

module.exports = timetableCreationTrend;
