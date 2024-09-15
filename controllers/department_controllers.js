const cloudinary = require("../configs/cloudinary");
const Department = require("../models/department");

const addDepartmentController = async (req, res) => {
    try {
        const { departmentName: name, hodName } = req.body;
        const hodSign = req.file;

        if (!name || typeof name !== "string" || !name.trim()) {
            return res
                .status(400)
                .json({ message: "Invalid department name." });
        }

        const trimmedName = name.trim();

        const dept = await Department.findOne({ name: trimmedName });
        if (dept) {
            return res.status(409).json({
                message: `The department '${
                    dept.name.charAt(0).toUpperCase() + dept.name.slice(1)
                }' already exists.`,
            });
        }

        if (!hodSign) {
            return res
                .status(400)
                .json({ message: "HOD signature is required." });
        }

        const newDept = await Department.create({
            name: trimmedName,
            hodName,
            hodSign: hodSign.path,
        });

        return res.status(201).json({
            message: "Department added successfully.",
            department: newDept,
        });
    } catch (error) {
        console.error("Error adding department:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const deleteDepartmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const dept = await Department.findById(id);
        if (dept?.hodSign) {
            const hodSignUrl = dept.hodSign;
            const publicId = hodSignUrl
                .split("/")
                .slice(-3)
                .join("/")
                .split(".")
                .slice(0, -1)
                .join(".");
            await cloudinary.uploader.destroy(publicId);
        }
        await Department.findByIdAndDelete(id);
        return res
            .status(201)
            .json({ message: "Department deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, error });
    }
};

const getDepartmentsController = async (_, res) => {
    try {
        const departments = await Department.find();
        return res.status(200).json({
            message: "Departments fetched successfully.",
            departments,
        });
    } catch (error) {
        console.error("Error fetching departments:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getDepartmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findById(id);
        return res
            .status(200)
            .json({ message: "Fetched dept successfully.", department });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, error });
    }
};
const editDepartmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const { departmentName: name, hodName } = req.body;
        const dept = await Department.findById(id);
        if (!dept._id)
            return res.status(404).json({ message: "Department not found." });

        if (req.file && dept.hodSign) {
            const hodSignUrl = dept.hodSign;
            const publicId = hodSignUrl
                .split("/")
                .slice(-3)
                .join("/")
                .split(".")
                .slice(0, -1)
                .join(".");

            const deletionResult = await cloudinary.uploader.destroy(publicId);
            console.log("Cloudinary Deletion Result:", deletionResult);
        }
        dept.name = name || dept.name;
        dept.hodName = hodName || dept.hodName;

        if (req.file) dept.hodSign = req.file.path;
        await dept.save();

        return res.status(200).json({
            message: "Updated department successfully.",
            department: dept,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = {
    addDepartmentController,
    deleteDepartmentController,
    editDepartmentController,
    getDepartmentController,
    getDepartmentsController,
};
