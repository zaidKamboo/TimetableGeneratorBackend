const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const getTimetableController = async (req, res) => {
    try {
        const _id = req.params.id;
        const timetable = await Timetable.findOne({ _id }).lean();

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found." });
        }

        // Fetch avatars for collaborators
        const collaboratorsWithDetails = await Promise.all(
            timetable.collaborators.map(async (collaboratorId) => {
                const collaborator = await User.findById(collaboratorId).lean();
                const profile = await Profile.findOne({ user: collaboratorId })
                    .select("avatar")
                    .lean();
                return {
                    _id: collaborator._id,
                    name: collaborator.name,
                    email: collaborator.email,
                    avatar: profile ? profile.avatar : null,
                };
            })
        );

        const populatedTimetable = {
            ...timetable,
            collaborators: collaboratorsWithDetails,
        };

        return res.status(200).json({
            message: "Fetched timetable successfully.",
            timetable: populatedTimetable,
        });
    } catch (error) {
        console.error(error?.message);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getTimetableController;
