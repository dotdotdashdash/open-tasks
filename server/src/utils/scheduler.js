const dayjs = require("dayjs");
const { dbPool } = require("./database");
const { updateTaskPriority } = require("../components/tasks/tasks-services");

async function priorityUpdationRoutine(time) {
    console.log(`Initiating Priority updation cron job`,)
    try {
        const connection = await dbPool.getConnection();

        let date = time
            ? dayjs(time).format(`YYYY-MM-DD`)
            : dayjs().format(`YYYY-MM-DD`)

        await updateTaskPriority(connection, date);        
    } catch (error) {
        console.log(`Error occured in cron job: `, error)
    }
}

async function callUserWithLapsedTasks(time) {
    console.log(`Initiating cron job to call users with lapsed tasks`,)
    try {
        const connection = await dbPool.getConnection();

        let date = time
            ? dayjs(time).format(`YYYY-MM-DD`)
            : dayjs().format(`YYYY-MM-DD`)

        
    } catch (error) {
        console.log(`Error occured in cron job: `, error)
    }
}

async function debugCronJobRoutines(req, res) {
    console.log('Triggered cron jobs');

    priorityUpdationRoutine();
    callUserWithLapsedTasks()

    res.end("Triggered")
}

module.exports = {
    priorityUpdationRoutine,
    callUserWithLapsedTasks,
    debugCronJobRoutines
}