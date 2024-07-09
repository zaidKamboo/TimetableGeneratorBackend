const Timetable = require("../../Models/Timetable");

const getUserTimetablesController = async (req, res) => {
    try {
        const createdBy = req.params.id;
        if (!createdBy)
            return res.status(402).json({ message: "Sorry invalid user." });
        const timetables = await Timetable.find({ createdBy });
        return res.status(200).json({
            message: "Fetched user timetables successfully",
            timetables,
        });
    } catch (error) {
        console.log(error?.message, error);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getUserTimetablesController;
