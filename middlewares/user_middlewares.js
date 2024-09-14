const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils");

const isLoggedIn = async (req, res, next) => {
    const { authToken } = req.cookies;
    if (!authToken) {
        return res
            ?.status(401)
            ?.json({ message: "Please Sign-Up / Login to continue." });
    }
    try {
        const decoded = jwt?.verify(authToken, JWT_SECRET);
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
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res
            .status(401)
            .json({ message: "Unauthorized: User data missing." });
    }

    if (req.user.role !== "admin") {
        return res
            .status(401)
            .json({ message: "Unauthorized: User is not an admin." });
    } else {
        next();
    }
};

module.exports = { isLoggedIn, isAdmin };
