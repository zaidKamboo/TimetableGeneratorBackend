const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../Models/User");
const { JWT_SECRET } = require("../../Contants");

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
module.exports = signupController;
