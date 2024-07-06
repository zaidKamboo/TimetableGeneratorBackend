const addMessageController = require("../Controllers/Messages/addMessageController");
const getMessagesController = require("../Controllers/Messages/getMessages");
const router = require("express").Router();

router.post("/addMessage", addMessageController);
router.get("/getMessages", getMessagesController);

module.exports = router;
