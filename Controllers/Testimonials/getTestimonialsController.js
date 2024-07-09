const Testimonial = require("../../Models/Testimonial");
const getTestimonialsController = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().populate("user");
        const { user } = req.query;
        if (user !== "undefined") {
            const testimonial = await Testimonial.findOne({ user })?.populate(
                "user"
            );
            return res.status(200).json({
                message: "Fetched testimonials successfully.",
                testimonials,
                testimonial: testimonial ?? {},
            });
        } else {
            const testimonial = {};
            return res.status(200).json({
                message: "Fetched testimonials successfully.",
                testimonials,
                testimonial,
            });
        }
    } catch (error) {
        console.log(error?.message);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = getTestimonialsController;
