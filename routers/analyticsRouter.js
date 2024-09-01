const {
    getAnalyticsController,
    getSettingAnalyticsController,
    getProfileAnalyticsController,
    getTestimonialsAnalyticsController,
} = require("../controllers/analyticsControllers");

const { isLoggedIn, isAdmin } = require("../middlewares/userMiddlewares");

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
