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

module.exports = isAdmin;
