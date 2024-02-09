const { sendJSONResponse } = require("../../utils/handler");
const subtaskServices = require("./subtasks-services");

async function retrieveUserSubTasks(req, res, next) {
    try {
        const user = req.locals.user
        const query = req.query
        const connection = req.locals.connection;
        const subtasks = await subtaskServices.findSubtasksByUserId(connection, user.user_id, query);

        let allSubtasks = [];
        for (let subtask of subtasks) {
            let userSubtask = new subtaskServices.Subtask(subtask)
            allSubtasks.push(userSubtask)
        }

        sendJSONResponse(res, {
            status: 200,
            data: {
                tasks: allSubtasks
            }
        })
    } catch (error) {
        next(error)
    }

}

module.exports = { retrieveUserSubTasks}