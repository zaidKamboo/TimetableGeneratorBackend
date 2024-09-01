const express = require("express");
const connectToDb = require("./configs/databaseConfig");
const app = express();
const cors = require("cors");
const port = 5000;
const cron = require("node-cron");
const deactivateInactiveUsers = require("./Utilities/deactivateInactiveUsers");
const setupSocket = require("./socket");
const cookieParser = require("cookie-parser");

cron.schedule("0 0 * * *", async () => {
    console.log("Running user maintenance job...");
    await deactivateInactiveUsers(7);
});

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
connectToDb();

app.use("/api/user", require("./routers/userRouter"));
app.use("/api/timetable", require("./routers/timetableRouter"));
app.use("/api/analytics", require("./routers/analyticsRouter"));
app.use("/api/setting", require("./routers/settingsRouter"));
app.use("/api/contact", require("./routers/contactMessagesRouter"));
app.use("/api/testimonial", require("./routers/testimonialRouter"));
app.use("/api/profile", require("./routers/profileRouter"));
app.use("/api/notification", require("./routers/notificationRouter"));

const expressServer = app.listen(port, () => {
    console.log(`TT Gen. backend listening on http://localhost:${port}`);
});
setupSocket(expressServer);
