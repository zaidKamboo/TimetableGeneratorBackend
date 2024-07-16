const Profile = require("../../Models/Profile");
const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const createNotification = require("../../Utilities/Notification/createNotification");

const removeCollaboratorController = async (req, res) => {
    try {
        const timetableId = req.params.id;
        const { collaboratorId } = req.query;

        const timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        const isCollaboratorPresent =
            timetable.collaborators.includes(collaboratorId);
        if (!isCollaboratorPresent) {
            return res
                .status(400)
                .json({ message: "Collaborator not found in this timetable" });
        }

        // Remove the collaborator
        timetable.collaborators = timetable.collaborators.filter(
            (id) => id.toString() !== collaboratorId
        );
        await timetable.save();

        const timetableDetails = `${timetable.className} - ${timetable.courseName}`;

        // Fetch the collaborator's details
        const collaborator = await User.findById(collaboratorId, "name").lean();
        if (!collaborator) {
            return res.status(404).json({ message: "Collaborator not found" });
        }

        // Create notifications
        await createNotification(
            timetable.createdBy,
            `${collaborator.name} has been removed from your timetable: ${timetableDetails}.`
        );

        await createNotification(
            collaboratorId,
            `You have been removed as a collaborator from the timetable: ${timetableDetails}.`
        );

        const collaboratorIds = timetable.collaborators;

        if (!collaboratorIds || collaboratorIds.length === 0) {
            return res.status(404).json({ message: "No collaborators found" });
        }

        // Fetch remaining collaborators' details
        const userPromises = collaboratorIds.map((id) =>
            User.findById(id, "name email _id").lean()
        );
        const users = await Promise.all(userPromises);

        const profilePromises = users.map((user) =>
            Profile.findOne({ user: user._id }, "avatar").lean()
        );
        const profiles = await Promise.all(profilePromises);

        const collaborators = users.map((user, index) => ({
            ...user,
            avatar: profiles[index]?.avatar || null,
        }));

        return res.status(200).json({
            message: "Collaborator removed successfully",
            removedCollaboratorId: collaboratorId,
            collaborators,
        });
    } catch (error) {
        console.error("Error removing collaborator:", error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = removeCollaboratorController;
