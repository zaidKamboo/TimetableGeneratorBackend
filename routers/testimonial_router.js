const {
    addTestimonialController,
    editTestimonialController,
    getTestimonialsController,
} = require("../controllers/testimonials_controllers");
const { isLoggedIn } = require("../middlewares/user_middlewares");
const router = require("express").Router();

router.post("/addTestimonial", isLoggedIn, addTestimonialController);
router.get("/getTestimonials", getTestimonialsController);
router.put("/editTestimonial/:id", isLoggedIn, editTestimonialController);

module.exports = router;
