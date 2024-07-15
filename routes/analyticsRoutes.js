const getAnalyticsController = require("../Controllers/Analytics/getAnalyticsController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const isAdmin = require("../Middlewares/User/isAdmin");
const getTestimonialsAnalyticsController = require("../Controllers/Analytics/getTestimonialsAnalyticsController");

const router = require("express").Router();

router.get("/getAnalytics", isLoggedIn, isAdmin, getAnalyticsController);
router.get(
    "/getTestimonialsAnalytics",
    isLoggedIn,
    isAdmin,
    getTestimonialsAnalyticsController
);

module.exports = router;
