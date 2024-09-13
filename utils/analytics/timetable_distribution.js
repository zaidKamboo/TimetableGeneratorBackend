const Timetable = require("../../models/timetable");

const timetableDistribution = async () => {
    const distribution = await Timetable.aggregate([
        {
            $group: {
                _id: "$departmentName",
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                count: -1,
            },
        },
    ]);

    const departments = distribution?.map((item) => item._id);
    const counts = distribution?.map((item) => item.count);

    return {
        departments,
        counts,
    };
};

module.exports = timetableDistribution;
