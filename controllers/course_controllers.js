const Course = require("../models/course");
const Department = require("../models/department");

const addCourseController = async (req, res) => {
    try {
        const { courseName: name, department } = req.body;

        if (!name || typeof name !== "string" || !name.trim() || !department) {
            return res
                .status(400)
                .json({ message: "Invalid course name or department ID." });
        }

        const trimmedName = name.trim();

        const dept = await Department.findById(department);
        if (!dept) {
            return res.status(404).json({ message: "Department not found." });
        }

        const existingCourse = await Course.findOne({
            name: trimmedName,
            department,
        });
        if (existingCourse) {
            return res.status(409).json({
                message: `Course '${trimmedName}' already exists in the ${dept.name} department.`,
            });
        }

        const newCourse = await Course.create({
            name: trimmedName,
            department,
        });

        return res.status(201).json({
            message: "Course added successfully.",
            course: newCourse,
        });
    } catch (error) {
        console.error("Error adding course:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getCoursesController = async (_, res) => {
    try {
        const courses = await Course.find().populate("department");
        return res
            .status(200)
            .json({ message: "Fetched courses successfully", courses });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = {
    addCourseController,
    getCoursesController,
};
