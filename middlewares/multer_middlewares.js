const { uploadAvatarConfig } = require("../configs/multer_configs");

const uploadAvatarMiddleware = (req, res, next) => {
    uploadAvatarConfig.single("avatar")(req, res, (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).send({ error: err.message });
        }
        console.log("Upload successful", req.file);
        next();
    });
};

module.exports = { uploadAvatarMiddleware };
