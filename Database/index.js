const mongoose = require("mongoose");

// DEMO PROJ PASS CLUSTER ZYcONQ2roJYuC2vn
const connectToDb = () => {
    try {
        mongoose
            .connect(
                "mongodb+srv://zaidkamboo100:ZYcONQ2roJYuC2vn@developmentcluster.lsf0cmq.mongodb.net/?retryWrites=true&w=majority&appName=DevelopmentCluster"
            )
            .then(() => {
                console.log("Connected to Db...");
            })
            .catch((err) => console.log(err?.message));
    } catch (error) {
        console.log(error?.message);
    }
};

module.exports = connectToDb;
