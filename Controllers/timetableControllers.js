const Timetable = require("../Models/Timetable");
const User = require("../Models/User");
const Notification = require("../Models/Notification");

const Profile = require("../Models/Profile");
const createNotification = require("../Utilities/Notification/createNotification");

const createTimetableController = async (req, res) => {
    try {
        const { departmentName, className, courseName, days, timeSlots } =
            req.body;

        if (
            !departmentName ||
            !className ||
            !courseName ||
            !days ||
            !timeSlots
        ) {
            return res
                .status(400)
                .json({ message: "Missing required fields." });
        }

        const newTimetable = await Timetable?.create({
            departmentName,
            className,
            courseName,
            days,
            timeSlots,
            createdBy: req?.user?._id,
        });

        return res.status(201).json({
            message: "Timetable created successfully.",
            timetable: newTimetable,
        });
    } catch (error) {
        res.status(500).json({ message: error.message, error });
    }
};

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

const deleteTimetableController = async (req, res) => {
    try {
        const timetableId = req.params.id;

        if (!timetableId) {
            return res
                .status(400)
                .json({ message: "Timetable ID is required." });
        }

        const timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found." });
        }

        const timetableDetails = `${timetable.className} - ${timetable.courseName}`;

        // Fetch collaborators' details
        const collaboratorIds = timetable.collaborators;
        const userPromises = collaboratorIds.map((id) =>
            User.findById(id, "name email _id").lean()
        );
        const users = await Promise.all(userPromises);

        // Send notifications to all collaborators
        const notificationPromises = users.map((user) =>
            createNotification(
                user._id,
                `The timetable: ${timetableDetails} has been deleted by the creator.`
            )
        );
        await Promise.all(notificationPromises);

        // Send notification to the creator
        await createNotification(
            timetable.createdBy,
            `You have deleted the timetable: ${timetableDetails}.`
        );

        await Timetable.findByIdAndDelete(timetableId);
        const timetables = await Timetable.find({ createdBy: req.user._id });

        return res.status(200).json({
            message: "Timetable deleted successfully.",
            timetables,
        });
    } catch (error) {
        console.error("Error deleting timetable:", error);
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
};

const editTimetableController = async (req, res) => {
    try {
        const id = req.params.id;
        const { departmentName, className, courseName, days, timeSlots } =
            req.body;

        const timetable = await Timetable.findById(id);
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        timetable.departmentName = departmentName || timetable.departmentName;
        timetable.className = className || timetable.className;
        timetable.courseName = courseName || timetable.courseName;
        timetable.days = days || timetable.days;
        timetable.timeSlots = timeSlots || timetable.timeSlots;

        await timetable.save();

        const userIdsToNotify = [
            timetable.createdBy,
            ...timetable.collaborators,
        ];
        const notifications = userIdsToNotify.map((userId) => ({
            userId,
            message: `The timetable for ${
                timetable?.className + "-" + timetable.courseName
            } has been updated.`,
            type: "info",
        }));
        await Notification.insertMany(notifications);

        return res
            .status(200)
            .json({ message: "Timetable updated successfully", timetable });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message, error });
    }
};

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

const getTimetableByCourseAndClassAndDeptName = async (req, res) => {
    const { courseName, className, departmentName } = req.query;

    try {
        const timetable = await Timetable.findOne({
            courseName,
            className,
            departmentName,
        });

        if (!timetable) {
            return res
                .status(404)
                .json({ message: "Timetable not found", timetable: [] });
        }

        return res
            .status(200)
            .json({ message: "Fetched timetable successfully", timetable });
    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ message: error?.message, error });
    }
};

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

module.exports = {
    createTimetableController,
    addCollaboratorsController,
    deleteTimetableController,
    editTimetableController,
    getCollaboratorsController,
    getTimetableByCourseAndClassAndDeptName,
    getTimetableController,
    getTimetablesController,
    getUserTimetablesController,
    removeCollaboratorController,
};
