const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("./cloudinary");

let storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "timetableGenerator/avatars",
        format: async (_, file) => {
            const formats = ["jpg", "jpeg", "png", "gif", "webp"];
            const mimeType = file.mimetype.split("/")[1];
            return formats.includes(mimeType) ? mimeType : "jpg";
        },
        public_id: (_, file) => `${Date.now()}_${file.originalname}`,
    },
});

const uploadAvatarConfig = multer({ storage: storage });

storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "timetableGenerator/hodSignatures",
        format: async (_, file) => {
            const formats = ["jpg", "jpeg", "png", "gif", "webp"];
            const mimeType = file.mimetype.split("/")[1];
            return formats.includes(mimeType) ? mimeType : "jpg";
        },
        public_id: (_, file) => `${Date.now()}_${file.originalname}`,
    },
});
const uploadHodSignConfig = multer({ storage: storage });

module.exports = { uploadAvatarConfig, uploadHodSignConfig };
