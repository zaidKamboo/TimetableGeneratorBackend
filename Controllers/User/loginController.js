const { JWT_SECRET } = require("../../Contants");
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        user.isActive = true;
        await user.save();
        return res.json({ token, user, message: "Logged in successfully." });
    } catch (error) {
        return res.status(500).json({ message: error?.message, error });
    }
};

module.exports = loginController;
