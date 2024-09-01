const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String },
        timezone: { type: String, default: "UTC" },
        notificationSettings: {
            timetableReminders: { type: Boolean, default: true },
            newsletterSubscribed: { type: Boolean, default: false },
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
