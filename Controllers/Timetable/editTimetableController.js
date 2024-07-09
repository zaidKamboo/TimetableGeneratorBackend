const Timetable = require("../../Models/Timetable");

const editTimetableController = async (req, res) => {
    try {
        const id = req.params.id;
        const { departmentName, className, courseName, days, timeSlots } =
            req.body;

        const timetable = await Timetable.findById(id);
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        timetable.departmentName = departmentName || timetable.departmentName;
        timetable.className = className || timetable.className;
        timetable.courseName = courseName || timetable.courseName;
        timetable.days = days || timetable.days;
        timetable.timeSlots = timeSlots || timetable.timeSlots;

        await timetable.save();

        return res
            .status(200)
            .json({ message: "Timetable updated successfully", timetable });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = editTimetableController;
