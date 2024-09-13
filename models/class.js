const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
