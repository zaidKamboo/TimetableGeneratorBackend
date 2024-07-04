const Timetable = require("../../Models/Timetable");

const getTimetablesController = async (req, res) => {
    try {
        const timetables = await Timetable.find();
        return res
            .status(200)
            .json({ message: "Fetched timetables successfully.", timetables });
    } catch (error) {
        console.log(error?.message, error);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getTimetablesController;
