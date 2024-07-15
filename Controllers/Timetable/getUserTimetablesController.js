const Timetable = require("../../Models/Timetable");
const User = require("../../Models/User");
const Profile = require("../../Models/Profile");

const getUserTimetablesController = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId)
            return res.status(400).json({ message: "Invalid user ID." });

        // Fetch timetables created by the user
        const createdTimetables = await Timetable.find({
            createdBy: userId,
        }).lean();

        // Fetch timetables where the user is a collaborator
        const collaboratedTimetables = await Timetable.find({
            collaborators: userId,
        }).lean();

        // Merge and remove duplicates
        const allTimetables = [
            ...createdTimetables,
            ...collaboratedTimetables.filter(
                (timetable) =>
                    !createdTimetables.some((ct) =>
                        ct._id.equals(timetable._id)
                    )
            ),
        ];

        // Fetch avatars for collaborators
        const populatedTimetables = await Promise.all(
            allTimetables.map(async (timetable) => {
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
                    ...timetable,
                    collaborators: collaboratorsWithDetails,
                };
            })
        );

        return res.status(200).json({
            message: "Fetched user timetables successfully",
            timetables: populatedTimetables,
        });
    } catch (error) {
        console.error(error?.message);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getUserTimetablesController;
