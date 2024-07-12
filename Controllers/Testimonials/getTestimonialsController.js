const Testimonial = require("../../Models/Testimonial");
const Profile = require("../../Models/Profile");

const getTestimonialsController = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().populate("user");
        const { user } = req.query;
        let testimonial = {};

        if (user !== "undefined") {
            testimonial = await Testimonial.findOne({ user }).populate("user");
        }

        const testimonialsWithAvatars = await Promise.all(
            testimonials.map(async (testimonial) => {
                const profile = await Profile.findOne({
                    user: testimonial.user._id,
                });
                return {
                    ...testimonial._doc,
                    avatar: profile ? profile.avatar : null,
                };
            })
        );

        let singleTestimonialWithAvatar = {};

        if (testimonial?._id) {
            const profile = await Profile.findOne({
                user: testimonial.user._id,
            });
            singleTestimonialWithAvatar = {
                ...testimonial._doc,
                avatar: profile ? profile.avatar : null,
            };
        }

        return res.status(200).json({
            message: "Fetched testimonials successfully.",
            testimonials: testimonialsWithAvatars,
            testimonial:
                user !== "undefined" ? singleTestimonialWithAvatar : {},
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message, error });
    }
};

module.exports = getTestimonialsController;
