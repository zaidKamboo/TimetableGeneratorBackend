const Message = require("../../Models/Message");

const addMessageController = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = await Message.create({ name, email, message });
        return res
            .status(201)
            .json({ message: "Received message successfully.", newMessage });
    } catch (error) {
        console.log(error?.message);
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = addMessageController;
