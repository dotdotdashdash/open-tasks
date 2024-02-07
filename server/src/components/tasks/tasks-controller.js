const taskServices = require(`./tasks-services`);
const { sendJSONResponse } = require(`./../../utils/handler`);

async function retrieveUserTasks (req, res, next) {
    try {
        const user = req.locals.user
        const connection = req.locals.connection;
        const tasks = await taskServices.findTasksByUserId(connection, user.user_id);

        let allTasks = [];
        for (let task of tasks) {
            let userTask = new taskServices.Task(task);
            allTasks.push(userTask)
        }

        sendJSONResponse(res, {
            status: 200,
            data: {
                tasks: allTasks
            }
        })
    } catch (error) {
        next(error)
    }
}

async function createTaskForUser(req, res, next) {
    try {
        const user = req.locals.user
        const connection = req.locals.connection;
        const tasks = req.body;

        let tasksPayload = [];
        for (let task of tasks) {
            let newTask = new taskServices.Task(task);
            newTask.userId = user.user_id;
            newTask.parsePayloadForInsert();

            tasksPayload.push(newTask.insertPayload)
        }

        let insertResults = await taskServices.bulkInsert(connection, tasksPayload)

        sendJSONResponse(res, {
            status: 200,
            data: {}
        })

        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    retrieveUserTasks,
    createTaskForUser
}
