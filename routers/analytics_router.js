const {
    getAnalyticsController,
    getSettingAnalyticsController,
    getProfileAnalyticsController,
    getTestimonialsAnalyticsController,
} = require("../controllers/analytics_controllers");

const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");

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
