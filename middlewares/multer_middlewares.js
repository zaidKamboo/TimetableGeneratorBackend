const {
    uploadAvatarConfig,
    uploadHodSignConfig,
} = require("../configs/multer_configs");

const uploadAvatarMiddleware = (req, res, next) => {
    uploadAvatarConfig.single("avatar")(req, res, (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).json({ message: err.message });
        }
        console.log("Upload successful", req.file);
        next();
    });
};

const uploadHodSignMiddleware = (req, res, next) => {
    uploadHodSignConfig.single("hodSign")(req, res, (err) => {
        if (err) {
            console.error("Upload error", err);
            return res.status(400).json({ message: err.message });
        }
        console.log("Upload successful", req.file);
        next();
    });
};

module.exports = { uploadAvatarMiddleware, uploadHodSignMiddleware };
