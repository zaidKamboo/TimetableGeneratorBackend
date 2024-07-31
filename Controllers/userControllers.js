const Notification = require("../Models/Notification");
const { JWT_SECRET } = require("../Contants");
const Profile = require("../Models/Profile");
const Setting = require("../Models/Setting");
const Testimonial = require("../Models/Testimonial");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const maxAge = 24 * 60 * 60 * 1000;

const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Sorry,a user with this email already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("authToken", token);
        return res.status(201).json({
            message: "User registered successfully.",
            token,
            user,
        });
    } catch (error) {
        console.log(error?.message, error);
        return res.status(500).json({ message: error?.message, error });
    }
};
// const insertUser = async () => {
//     try {
//         const name = "Rohit Sharma";
//         const email = "rohitsharma100@gmail.com";
//         const password = "nothing";
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             createdAt: "2024-06-25T00:00:00.454+00:00",
//             isActive: false,
//         });
//         console.log("Created", user);
//     } catch (error) {
//         console.log(error?.message, error);
//     }
// };
// insertUser();

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user?.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        user.isActive = true;
        await user.save();
        const setting = await Setting.findOne({ user: user?._id });
        const profile = await Profile.findOne({ user: user?._id });
        const testimonial = await Testimonial.findOne({ user: user?._id });

        res.cookie("authToken", token, {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({
            token,
            user,
            message: "Logged in successfully.",
            setting,
            profile,
            testimonial,
        });
    } catch (error) {
        return res.status(500).json({ message: error?.message, error });
    }
};
// Admin
// let f = async () => {
//     const user = await User.findOne({ email: "zaidkamboo100@gmail.com" });
//     console.log(user);
// };
// f();

const getNotificationsController = async (req, res) => {
    try {
        const userId = req.params.id;
        const notifications = await Notification.find({ userId });
        return res.status(200).json({
            message: "Fetched user's notifications successfully.",
            notifications,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message, error });
    }
};

const getUsersController = async (_, res) => {
    try {
        const users = await User.find().lean();

        return res.status(200).json({ users });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({ message: error.message, error });
    }
};

const getUsersAndProfilesController = async (_, res) => {
    try {
        const users = await User.find({}, "name email _id").lean();

        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }

        const profilePromises = users.map((user) =>
            Profile.findOne({ user: user._id }, "avatar").lean()
        );

        const profiles = await Promise.all(profilePromises);

        const usersAndProfiles = users.map((user, index) => ({
            ...user,
            avatar: profiles[index]?.avatar || null,
        }));
        console.log(usersAndProfiles);
        return res.status(200).json({ users: usersAndProfiles });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({ message: error.message, error });
    }
};

const logoutController = (req, res) => {
    try {
        res.cookie("authToken", "");
        return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message });
    }
};

module.exports = {
    logoutController,
    loginController,
    signupController,
    getNotificationsController,
    getUsersController,
    getUsersAndProfilesController,
};
