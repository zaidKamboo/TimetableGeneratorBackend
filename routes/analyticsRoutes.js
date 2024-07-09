const getAnalyticsController = require("../Controllers/Analytics/getAnalyticsController");
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const isAdmin = require("../Middlewares/User/isAdmin");

const router = require("express").Router();

router.get("/getAnalytics", isLoggedIn, isAdmin, getAnalyticsController);

module.exports = router;
