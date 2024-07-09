const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingsSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        darkMode: {
            type: Boolean,
            default: false,
        },
        language: {
            type: String,
            default: "en",
        },
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        smsNotifications: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Setting", settingsSchema);
