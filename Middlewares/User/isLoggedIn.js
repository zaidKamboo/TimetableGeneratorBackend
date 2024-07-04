const jwt = require("jsonwebtoken");
const User = require("../../Models/User");
const { JWT_SECRET } = require("../../Contants");

const isLoggedIn = async (req, res, next) => {
    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
        return res
            ?.status(401)
            ?.json({ message: "Please Sign-Up / Login to continue." });
    }
    const token = authHeader?.split(" ")[1];
    try {
        const decoded = jwt?.verify(token, JWT_SECRET);

        const user = await User?.findById(decoded.id);

        if (!user) {
            return res?.status(401)?.json({ message: "User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        console?.error("Error verifying token:", error?.message);
        res?.status(401)?.json({ message: "Token is invalid or expired" });
    }
};

module.exports = isLoggedIn;
