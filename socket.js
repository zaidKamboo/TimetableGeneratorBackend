const { Server } = require("socket.io");
const mongoose = require("mongoose");
const ChatMessage = require("./Models/ChatMessage");
const Profile = require("./Models/Profile");

const setupSocket = (expressServer) => {
    const io = new Server(expressServer, {
        cors: {
            origin: ["http://localhost:5173"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        try {
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);
            const createdMessage = await ChatMessage.create(message);

            const messageData = await ChatMessage.aggregate([
                { $match: { _id: createdMessage._id } },
                {
                    $lookup: {
                        from: "profiles",
                        localField: "sender",
                        foreignField: "user",
                        as: "senderProfile",
                    },
                },
                { $unwind: "$senderProfile" },
                {
                    $lookup: {
                        from: "profiles",
                        localField: "recipient",
                        foreignField: "user",
                        as: "recipientProfile",
                    },
                },
                { $unwind: "$recipientProfile" },
                {
                    $addFields: {
                        "sender.avatar": "$senderProfile.avatar",
                        "recipient.avatar": "$recipientProfile.avatar",
                    },
                },
                {
                    $project: {
                        senderProfile: 0,
                        recipientProfile: 0,
                    },
                },
            ]);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData[0]);
            }
            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(
                `User connected: ${userId} with socket ID: ${socket.id}`
            );
        } else {
            console.log("User ID not provided during connection.");
        }

        socket.on("sendMessage", sendMessage);

        socket.on("disconnect", () => disconnect(socket));
    });
};

module.exports = setupSocket;
