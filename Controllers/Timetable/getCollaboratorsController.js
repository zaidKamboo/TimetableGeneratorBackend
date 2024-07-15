const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const getCollaboratorsController = async (req, res) => {
    try {
        const timetableId = req.params.id;

        const timetable = await Timetable.findById(timetableId).lean();

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        const collaboratorIds = timetable.collaborators;

        if (!collaboratorIds || collaboratorIds.length === 0) {
            return res.status(404).json({ message: "No collaborators found" });
        }

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

        return res.status(200).json({ collaborators });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = getCollaboratorsController;
