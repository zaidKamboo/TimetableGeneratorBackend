const addMessageController = require("../Controllers/Messages/addMessageController");
const getMessagesController = require("../Controllers/Messages/getMessages");
const router = require("express").Router();
const isLoggedIn = require("../Middlewares/User/isLoggedIn");
const isAdmin = require("../Middlewares/User/isAdmin");

router.post("/addMessage", isLoggedIn, addMessageController);
router.get("/getMessages", isLoggedIn, isAdmin, getMessagesController);

module.exports = router;
