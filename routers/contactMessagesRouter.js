const router = require("express").Router();
const {
    getMessagesController,
    addMessageController,
} = require("../Controllers/contactMessagesController");
const { isLoggedIn, isAdmin } = require("../Middlewares/userMiddlewares");

router.post("/addMessage", isLoggedIn, addMessageController);
router.get("/getMessages", isLoggedIn, isAdmin, getMessagesController);

module.exports = router;
