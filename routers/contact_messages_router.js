const router = require("express").Router();
const {
    getMessagesController,
    addMessageController,
} = require("../controllers/contact_messages_controller");
const { isLoggedIn, isAdmin } = require("../middlewares/user_middlewares");

router.post("/addMessage", isLoggedIn, addMessageController);
router.get("/getMessages", isLoggedIn, isAdmin, getMessagesController);

module.exports = router;
