const addMessageController = require("../Controllers/Messages/addMessageController");
const getMessagesController = require("../Controllers/Messages/getMessages");
const router = require("express").Router();
const isLoggedIn = require("../Middlewares/User/isLoggedIn");

router.post("/addMessage", isLoggedIn, addMessageController);
router.get("/getMessages", getMessagesController);

module.exports = router;
