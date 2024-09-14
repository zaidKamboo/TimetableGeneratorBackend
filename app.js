const express = require("express");
const cron = require("node-cron");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectToDb = require("./configs/database_config");
const setupSocket = require("./socket");
const { deactivateInactiveUsers } = require("./utils");

const app = express();
const port = 5000;

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

app.use("/api/user", require("./routers/user_router"));
app.use("/api/timetable", require("./routers/timetable_router"));
app.use("/api/analytics", require("./routers/analytics_router"));
app.use("/api/setting", require("./routers/settings_router"));
app.use("/api/contact", require("./routers/contact_messages_router"));
app.use("/api/testimonial", require("./routers/testimonial_router"));
app.use("/api/profile", require("./routers/profile_router"));
app.use("/api/notification", require("./routers/notification_router"));
app.use("/api/department", require("./routers/department_router"));
app.use("/api/course", require("./routers/course_router"));
app.use("/api/class", require("./routers/class_router"));

const expressServer = app.listen(port, () => {
    console.log(`TT Gen. backend listening on http://localhost:${port}`);
});
setupSocket(expressServer);
