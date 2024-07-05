const mongoose = require("mongoose");
const Timetable = require("../../Models/Timetable");

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

    const formattedTrend = trend.map((item) => ({
        year: item._id.year,
        month: item._id.month,
        count: item.count,
    }));

    return formattedTrend;
};

module.exports = timetableCreationTrend;
