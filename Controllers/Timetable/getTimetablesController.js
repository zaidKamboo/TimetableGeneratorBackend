const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const getTimetablesController = async (req, res) => {
    try {
        const timetables = await Timetable.find();

        const populatedTimetables = await Promise.all(
            timetables.map(async (timetable) => {
                const collaboratorsWithDetails = await Promise.all(
                    timetable.collaborators.map(async (collaboratorId) => {
                        const collaborator = await User.findById(
                            collaboratorId
                        ).lean();
                        const profile = await Profile.findOne({
                            user: collaboratorId,
                        })
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

                return {
                    ...timetable.toObject(),
                    collaborators: collaboratorsWithDetails,
                };
            })
        );

        return res.status(200).json({
            message: "Fetched timetables successfully.",
            timetables: populatedTimetables,
        });
    } catch (error) {
        console.error(error?.message);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getTimetablesController;
