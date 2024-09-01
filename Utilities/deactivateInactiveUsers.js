const User = require("../models/user");

const deactivateInactiveUsers = async (inactivePeriodDays) => {
    try {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - inactivePeriodDays);

        const result = await User.updateMany(
            { updatedAt: { $lt: thresholdDate }, isActive: true },
            { $set: { isActive: false } }
        );

        console.log(`${result.nModified} users have been deactivated.`);
    } catch (error) {
        console.error("Error deactivating users:", error);
    }
};

module.exports = deactivateInactiveUsers;
