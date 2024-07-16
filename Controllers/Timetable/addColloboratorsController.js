const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const createNotification = require("../../Utilities/Notification/createNotification");

const addCollaboratorsController = async (req, res) => {
    try {
        const timetableId = req.params.id;
        const { collaboratorIds } = req.body;

        const timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        const newCollaborators = collaboratorIds.filter(
            (collaboratorId) =>
                !timetable.collaborators.includes(collaboratorId)
        );

        if (newCollaborators.length === 0) {
            return res
                .status(304)
                .json({ message: "All collaborators were already added." });
        }

        timetable.collaborators.push(...newCollaborators);
        await timetable.save();

        const timetableDetails = `${timetable.className} - ${timetable.courseName}`;

        // Fetch details of new collaborators
        const collaboratorsDetails = await Promise.all(
            newCollaborators.map((collaboratorId) =>
                User.findById(collaboratorId, "name").lean()
            )
        );

        const collaboratorNames = collaboratorsDetails
            .map((collaborator) => collaborator.name)
            .join(", ");

        // Notify the creator
        await createNotification(
            timetable.createdBy,
            `New collaborators (${collaboratorNames}) have been added to your timetable: ${timetableDetails}.`
        );

        // Notify each new collaborator
        for (const collaborator of collaboratorsDetails) {
            await createNotification(
                collaborator._id,
                `${collaborator.name}, you have been added as a collaborator to the timetable: ${timetableDetails}.`
            );
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

module.exports = addCollaboratorsController;
