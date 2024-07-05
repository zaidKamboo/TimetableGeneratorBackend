const express = require("express");
const connectToDb = require("./Database");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(express.json());
app.use(cors());

connectToDb();

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
