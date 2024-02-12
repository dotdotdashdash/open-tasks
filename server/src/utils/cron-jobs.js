const cron = require(`node-cron`);
const { priorityUpdationRoutine, callUsersRoutine } = require("./scheduler");

cron.schedule('* * 1 * * * *', priorityUpdationRoutine);
cron.schedule('* * 1 * * * *', callUsersRoutine);

