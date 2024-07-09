const addTestimonialController = require("../Controllers/Testimonials/addTestimonialController");
const editTestimonialController = require("../Controllers/Testimonials/editTestimonialController");
const getTestimonialsController = require("../Controllers/Testimonials/getTestimonialsController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const router = require("express").Router();

router.post("/addTestimonial", isLoggedIn, addTestimonialController);
router.get("/getTestimonials", getTestimonialsController);
router.put("/editTestimonial/:id", isLoggedIn, editTestimonialController);

module.exports = router;
