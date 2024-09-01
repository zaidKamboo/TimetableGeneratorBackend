const {
    addTestimonialController,
    editTestimonialController,
    getTestimonialsController,
} = require("../controllers/testimonialsControllers");
const { isLoggedIn } = require("../middlewares/userMiddlewares");
const router = require("express").Router();

router.post("/addTestimonial", isLoggedIn, addTestimonialController);
router.get("/getTestimonials", getTestimonialsController);
router.put("/editTestimonial/:id", isLoggedIn, editTestimonialController);

module.exports = router;
