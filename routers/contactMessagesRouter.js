const router = require("express").Router();
const {
    getMessagesController,
    addMessageController,
} = require("../controllers/contactMessagesController");
const { isLoggedIn, isAdmin } = require("../middlewares/userMiddlewares");

router.post("/addMessage", isLoggedIn, addMessageController);
router.get("/getMessages", isLoggedIn, isAdmin, getMessagesController);

module.exports = router;
