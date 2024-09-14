const Class = require("../models/class");
const Department = require("../models/department");
const Course = require("../models/course");

const addClassController = async (req, res) => {
    try {
        const { class: name, departmentId, courseId } = req.body;
        if (!name || !departmentId || !courseId) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields are required: class name, department, and course.",
            });
        }

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found.",
            });
        }

        const course = await Course.findById(courseId);
        if (!course || String(course.department) !== String(departmentId)) {
            return res.status(404).json({
                success: false,
                message:
                    "Course not found or doesn't belong to the selected department.",
            });
        }

        const existingClass = await Class.findOne({
            name,
            department: departmentId,
            course: courseId,
        });

        if (existingClass) {
            return res.status(400).json({
                success: false,
                message:
                    "Class with the same name already exists for this department and course.",
            });
        }
        const newClass = await Class.create({
            name,
            department: departmentId,
            course: courseId,
        });
        return res.status(201).json({
            success: true,
            message: "Class successfully created.",
            data: newClass,
        });
    } catch (error) {
        console.error("Error in addClass:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the class.",
            error: error.message,
        });
    }
};

const getClassesController = async (_, res) => {
    try {
        const classes = await Class.find()
            .populate("department")
            .populate("course");
        console.log(classes);
        return res.status(200).json({
            success: true,
            message: "Classes retrieved successfully.",
            classes,
        });
    } catch (error) {
        console.error("Error in getClasses:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving classes.",
            error: error.message,
        });
    }
};

module.exports = { addClassController, getClassesController };
