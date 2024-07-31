const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        messageType: {
            type: String,
            enum: ["text", "file"],
            required: true,
        },
        content: {
            type: String,
            required: function () {
                return this.messageType === "text";
            },
        },
        fileUrl: {
            type: String,
            required: function () {
                return this.messageType === "file";
            },
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
