const express = require("express");
const connectToDb = require("./Database");
const app = express();
const cors = require("cors");
const port = 5000;
const cron = require("node-cron");
const deactivateInactiveUsers = require("./Utilities/deactivateInactiveUsers");

cron.schedule("0 0 * * *", async () => {
    console.log("Running user maintenance job...");
    await deactivateInactiveUsers(7);
});

app.use(express.json());
app.use(cors());

connectToDb();

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/setting", require("./routes/settingsRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));

app.listen(port, () => {
    console.log(`TT Gen. backend listening on port ${port}`);
});
