const Message = require("../../Models/Message");

const getMessagesController = async (req, res) => {
    try {
        const messages = await Message.find();
        return res
            .status(200)
            .json({ message: "Fetched messages successfully.", messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = getMessagesController;
