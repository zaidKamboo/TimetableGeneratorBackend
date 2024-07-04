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
        departmentName: { type: String, required: true },
        className: { type: String, required: true },
        courseName: { type: String, required: true },
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
