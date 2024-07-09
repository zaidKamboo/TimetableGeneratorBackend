const Testimonial = require("../../Models/Testimonial");

const editTestimonialController = async (req, res) => {
    try {
        const _id = req.params.id;
        const { message, rating, user } = req.body;

        if (!message || !rating || !user) {
            return res
                .status(400)
                .json({ message: "All fields are required." });
        }

        const existingTestimonial = await Testimonial.findById(_id);

        if (!existingTestimonial) {
            return res.status(404).json({ message: "Testimonial not found." });
        }

        if (existingTestimonial.user.toString() !== user) {
            return res.status(403).json({
                message: "You are not authorized to edit this testimonial.",
            });
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            _id,
            { message, rating },
            { new: true }
        );

        return res.status(200).json({
            message: "Testimonial updated successfully.",
            testimonial: updatedTestimonial,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = editTestimonialController;
