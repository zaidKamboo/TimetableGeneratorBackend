const Timetable = require("../../Models/Timetable");

const isAuthorized = async (req, res, next) => {
    const timetableId = req.params.id;
    const userId = req.user._id;
    console.log(timetableId, userId);
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
        return res.status(404).json({ message: "Timetable not found." });
    }
    if (
        timetable.createdBy.toString() !== userId.toString() &&
        !timetable.collaborators.includes(userId)
    ) {
        return res.status(403).json({
            message: "You are not authorized to modify this timetable.",
        });
    }
    next();
};

module.exports = isAuthorized;
