const Timetable = require("../../Models/Timetable");

const isOwner = async (req, res, next) => {
    try {
        const timetableId = req.params.id;
        const userId = req.user._id;

        const timetable = await Timetable.findById(timetableId);

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found." });
        }

        if (timetable.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this timetable.",
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

module.exports = isOwner;
