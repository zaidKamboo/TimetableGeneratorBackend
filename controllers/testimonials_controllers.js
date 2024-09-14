const Testimonial = require("../models/testimonial");
const Profile = require("../models/profile");

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
module.exports = {
    addTestimonialController,
    editTestimonialController,
    getTestimonialsController,
};
