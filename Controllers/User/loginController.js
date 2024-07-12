const { JWT_SECRET } = require("../../Contants");
const Profile = require("../../Models/Profile");
const Setting = require("../../Models/Setting");
const Testimonial = require("../../Models/Testimonial");
const User = require("../../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        return res.status(201).json({
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

module.exports = loginController;
