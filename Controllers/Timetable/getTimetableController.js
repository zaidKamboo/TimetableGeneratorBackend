const Timetable = require("../../Models/Timetable");

const getTimetableController = async (req, res) => {
    try {
        const _id = req.params.id;
        const timetable = await Timetable.findOne({ _id });
        return res
            .status(200)
            .json({ message: "Fetched timetable successfully.", timetable });
    } catch (error) {
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getTimetableController;
