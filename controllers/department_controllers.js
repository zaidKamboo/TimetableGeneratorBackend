const Department = require("../models/department");

const addDepartmentController = async (req, res) => {
    try {
        const { departmentName: name } = req.body;
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

        const newDept = await Department.create({ name: trimmedName });
        return res.status(201).json({
            message: "Department added successfully.",
            department: newDept,
        });
    } catch (error) {
        console.error("Error adding department:", error);
        return res.status(500).json({ message: "Internal server error." });
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

module.exports = {
    addDepartmentController,
    getDepartmentsController,
};
