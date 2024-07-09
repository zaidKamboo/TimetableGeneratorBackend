const Timetable = require("../../Models/Timetable");

const getTimetableByCourseAndClassAndDeptName = async (req, res) => {
    const { courseName, className, departmentName } = req.query;

    try {
        const timetable = await Timetable.findOne({
            courseName,
            className,
            departmentName,
        });

        if (!timetable) {
            return res
                .status(404)
                .json({ message: "Timetable not found", timetable: [] });
        }

        return res
            .status(200)
            .json({ message: "Fetched timetable successfully", timetable });
    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getTimetableByCourseAndClassAndDeptName;
