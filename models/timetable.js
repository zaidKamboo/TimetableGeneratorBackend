const { default: mongoose } = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
    {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        subject: { type: String, required: true },
        classroom: { type: String, required: true },
    },
    { _id: false }
);

const timetableSchema = new mongoose.Schema(
    {
        departmentName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        className: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        courseName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        days: { type: [String], required: true },
        timeSlots: {
            allDays: [timeSlotSchema],
            Monday: [timeSlotSchema],
            Tuesday: [timeSlotSchema],
            Wednesday: [timeSlotSchema],
            Thursday: [timeSlotSchema],
            Friday: [timeSlotSchema],
            Saturday: [timeSlotSchema],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
