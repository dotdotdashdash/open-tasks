const taskServices = require(`./tasks-services`);
const subtaskServices = require("../subtasks/subtasks-services");
const { sendJSONResponse, throwError } = require(`./../../utils/handler`);

async function retrieveUserTasks (req, res, next) {
    try {
        const user = req.locals.user
        const query = req.query
        const connection = req.locals.connection;
        const tasks = await taskServices.findTasksByUserId(connection, user.user_id, query);

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

async function createTasksForUser(req, res, next) {
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

        await taskServices.bulkInsert(connection, tasksPayload)

        sendJSONResponse(res, {
            status: 200,
            message: "Successfully added the tasks",
            data: {}
        });
    } catch (error) {
        next(error)
    }
}

async function createSubtasksForTask(req, res, next) {
    try {
        const connection = req.locals.connection;
        const subtasks = req.body;
        const { taskId } = req.params
        
        let subtasksPayload = [];
        for (let subtask of subtasks) {
            let newSubtask = new subtaskServices.Subtask(subtask);
            newSubtask.taskId = taskId
            newSubtask.parsePayloadForInsert();

            subtasksPayload.push(newSubtask.insertPayload)
        }

        await subtaskServices.bulkInsert(connection, subtasksPayload)

        sendJSONResponse(res, {
            status: 200,
            message: "Successfully added the subtasks",
            data: {}
        });
    } catch (error) {
        if (error.code == 'ER_NO_REFERENCED_ROW_2') {
            error.httpErrorCode = 404;
            error.errorMessage = "Can't find task with the given ID"
        }
        next(error)
    }
}

async function editTaskById(req, res, next) {
    try {
        const connection = req.locals.connection;
        const { taskId } = req.params;
        const editPayload = req.body;
        const userId = req.locals.user.user_id

        const task = new taskServices.Task({
            id: taskId,
            dueDate: editPayload.dueDate,
            status: editPayload.status,
            userId
        });

        console.log(`\n\n>>>>>------${new Date().toLocaleTimeString('en-us',{ timeZone: 'Asia/Calcutta', hour: '2-digit', minute: '2-digit', second: '2-digit',  fractionalSecondDigits: 3 })}------->>\n | file: tasks-controller.js:101 | editTaskById | task::`, task);


        task.verifyTaskExistenceForUser(connection)

        
    } catch (error) {
        
    }

}

async function deleteTaskById(req, res, next) {

}

module.exports = {
    retrieveUserTasks,
    createTasksForUser,
    createSubtasksForTask,
    editTaskById,
    deleteTaskById
}
