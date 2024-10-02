const Timetable = require("../../models/timetable");

const timetableDistribution = async () => {
    const distribution = await Timetable.aggregate([
        // Join the Department collection to get department names
        {
            $lookup: {
                from: "departments", // Collection name of the department
                localField: "departmentName",
                foreignField: "_id",
                as: "departmentDetails",
            },
        },
        {
            $unwind: "$departmentDetails", // Unwind the array to get a single department object
        },
        // Join the Class collection to get class names
        {
            $lookup: {
                from: "classes", // Collection name of the class
                localField: "className",
                foreignField: "_id",
                as: "classDetails",
            },
        },
        {
            $unwind: "$classDetails", // Unwind the array to get a single class object
        },
        // Join the Course collection to get course names
        {
            $lookup: {
                from: "courses", // Collection name of the course
                localField: "courseName",
                foreignField: "_id",
                as: "courseDetails",
            },
        },
        {
            $unwind: "$courseDetails", // Unwind the array to get a single course object
        },
        // Group by department name and count occurrences
        {
            $group: {
                _id: "$departmentDetails.name", // Group by the actual department name
                count: { $sum: 1 }, // Count the number of timetables per department
            },
        },
        // Sort by count in descending order
        {
            $sort: {
                count: -1,
            },
        },
    ]);

    // Extract the departments and counts
    const departments = distribution.map((item) => item._id);
    const counts = distribution.map((item) => item.count);

    return {
        departments,
        counts,
    };
};

module.exports = timetableDistribution;
