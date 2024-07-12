const Timetable = require("../../Models/Timetable");

const addCollaboratorsController = async (req, res) => {
    try {
        const timetableId = req.params.id;
        const { collaboratorIds } = req.body;

        const timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        const newCollaborators = [];

        // Iterate over the array of collaborator IDs
        for (const collaboratorId of collaboratorIds) {
            if (!timetable?.collaborators?.includes(collaboratorId)) {
                timetable?.collaborators?.push(collaboratorId);
                newCollaborators?.push(collaboratorId);
            }
        }

        await timetable?.save();

        if (newCollaborators.length === 0) {
            return res
                .status(300)
                .json({ message: "All collaborators were already added." });
        }

        return res.status(200).json({
            message: "Collaborators added successfully",
            newCollaborators,
            timetable,
        });
    } catch (error) {
        console.error("Error adding collaborators:", error);
        return res.status(500).json({ message: error.message, error });
    }
};
// let f = async () => {
//     const t = await Timetable.find().populate("createdBy");
//     let t1 = await Timetable.findOne({
//         className: "SY",
//         departmentName: "BCA",
//     }).populate("createdBy");
//     console.log(t1);
// };
// f();
module.exports = addCollaboratorsController;
