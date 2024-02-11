const cron = require(`node-cron`);
const { priorityUpdationRoutine, callUserWithLapsedTasks } = require("./scheduler");

cron.schedule('* 1 * * * * *', priorityUpdationRoutine);

cron.schedule('*/5 * * * * * *', callUserWithLapsedTasks);

