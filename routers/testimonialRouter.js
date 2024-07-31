const {
    addTestimonialController,
    editTestimonialController,
    getTestimonialsController,
} = require("../Controllers/testimonialsControllers");
const { isLoggedIn } = require("../Middlewares/userMiddlewares");
const router = require("express").Router();

router.post("/addTestimonial", isLoggedIn, addTestimonialController);
router.get("/getTestimonials", getTestimonialsController);
router.put("/editTestimonial/:id", isLoggedIn, editTestimonialController);

module.exports = router;
