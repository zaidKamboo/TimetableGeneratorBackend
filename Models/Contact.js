const { default: mongoose } = require("mongoose");

const contactSchema = new mongoose.Schema({

    
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
