const Testimonial = require("../../Models/Testimonial");

const addTestimonialController = async (req, res) => {
    try {
        const { user, title, message, rating } = req.body;
        const testimonial = await Testimonial.create({
            user,
            title,
            message,
            rating,
        });
        return res.status(201).json({
            message: "Testimonial added successfully!",
            testimonial,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = addTestimonialController;
