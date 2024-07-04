const Timetable = require("../../Models/Timetable");

const createTimetableController = async (req, res) => {
    try {
        const { departmentName, className, courseName, days, timeSlots } =
            req.body;

        if (
            !departmentName ||
            !className ||
            !courseName ||
            !days ||
            !timeSlots
        ) {
            return res
                .status(400)
                .json({ message: "Missing required fields." });
        }

        const newTimetable = await Timetable?.create({
            departmentName,
            className,
            courseName,
            days,
            timeSlots,
            createdBy: req?.user?._id,
        });

        return res.status(201).json({
            message: "Timetable created successfully.",
            timetable: newTimetable,
        });
    } catch (error) {
        res.status(500).json({ message: error.message, error });
    }
};

module.exports = createTimetableController;
