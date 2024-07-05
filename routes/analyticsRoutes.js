const getAnalyticsController = require("../Controllers/Analytics/getAnalyticsController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");

const router = require("express").Router();

router.get("/getAnalytics", isLoggedIn, getAnalyticsController);

module.exports = router;
