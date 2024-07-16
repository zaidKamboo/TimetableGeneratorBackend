const getAnalyticsController = require("../Controllers/Analytics/getAnalyticsController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const isAdmin = require("../Middlewares/User/isAdmin");
const getTestimonialsAnalyticsController = require("../Controllers/Analytics/getTestimonialsAnalyticsController");
const getProfileAnalyticsController = require("../Controllers/Analytics/getProfileAnalyticsController");
const getSettingAnalyticsController = require("../Controllers/Analytics/getSettingAnalyticsController");

const router = require("express").Router();

router.get("/getAnalytics", isLoggedIn, isAdmin, getAnalyticsController);
router.get(
    "/getTestimonialsAnalytics",
    isLoggedIn,
    isAdmin,
    getTestimonialsAnalyticsController
);
router.get(
    "/getProfileAnalytics",
    isLoggedIn,
    isAdmin,
    getProfileAnalyticsController
);

router.get(
    "/getSettingAnalytics",
    isLoggedIn,
    isAdmin,
    getSettingAnalyticsController
);

module.exports = router;
