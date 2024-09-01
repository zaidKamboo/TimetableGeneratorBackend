const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 100,
            match: /\S+@\S+\.\S+/,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
