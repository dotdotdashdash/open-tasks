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

async function editSubtaskById(req, res, next) {
    try {
        const connection = req.locals.connection;
        const { subtaskId } = req.params;
        const editPayload = req.body;
        const userId = req.locals.user.user_id

        const subtask = new subtaskServices.Subtask({
            id: subtaskId,
            status: editPayload.status
        });
        await subtask.verifySubtaskExistenceForUser(connection, userId);
        await subtask.update(connection);

        sendJSONResponse(res, {
            status: 200,
            message: "Successfully updated the subtask",
            data: {}
        });
    } catch (error) {
        next(error)
    }
}

async function deleteSubtaskById(req, res, next) {
    
}

module.exports = {
    retrieveUserSubTasks,
    deleteSubtaskById,
    editSubtaskById
}