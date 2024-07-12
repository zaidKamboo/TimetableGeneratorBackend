const Timetable = require("../../Models/Timetable");

const deleteTimetableController = async (req, res) => {
    try {
        const timetableId = req.params.id;

        if (!timetableId) {
            return res
                .status(400)
                .json({ message: "Timetable ID is required." });
        }

        const timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found." });
        }

        await Timetable.findByIdAndDelete(timetableId);
        const timetables = await Timetable.find({ createdBy: req.user._id });

        return res
            .status(200)
            .json({ message: "Timetable deleted successfully.", timetables });
    } catch (error) {
        console.error("Error deleting timetable:", error);
        res.status(500).json({
            message: error?.message + ".",
            error: error,
        });
    }
};

module.exports = deleteTimetableController;
