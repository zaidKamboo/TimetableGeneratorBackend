const Testimonial = require("../../Models/Testimonial");

const getTestimonialsAnalyticsController = async (_, res) => {
    try {
        const testimonials = await Testimonial.find().populate("user", "name");
        const totalRatings = testimonials.reduce(
            (acc, curr) => acc + curr.rating,
            0
        );
        const averageTestimonialRating =
            testimonials.length > 0 ? totalRatings / testimonials.length : 0;

        const ratingsCounts = Array.from({ length: 5 }, () => 0);
        testimonials.forEach((testimonial) => {
            ratingsCounts[testimonial.rating - 1]++;
        });

        const testimonialsDistribution = {
            counts: ratingsCounts,
        };

        return res.status(200).json({
            analytics: {
                testimonials,
                averageTestimonialRating,
                testimonialsDistribution,
            },
            message: "Testimonials analytics fetched successfully.",
        });
    } catch (error) {
        console.error(error.message, error);
        return res.status(500).json({
            message: error?.message,
            error,
        });
    }
};

module.exports = getTestimonialsAnalyticsController;
