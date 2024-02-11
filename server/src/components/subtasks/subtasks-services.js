const subtasksModel = require(`./subtasks-model`)
const tasksModel = require(`./../tasks/tasks-model`)

class Subtask {
    constructor(data = {}) {
        this.id = data.id
        this.taskId = data.task_id || data.taskId;
        this.description = data.description;
        this.status = data.status;
        this.createdAt = data.created_at || data.createdAt;
        this.updatedAt = data.updated_at || data.updatedAt;
        this.deletedAt = data.deleted_at || data.deletedAt;
    }

    parsePayloadForInsert() {
        this.insertPayload = {
            task_id: this.taskId,
            description: this.description,
            status: 0,
        }
    }

    async verifySubtaskExistenceForUser(connection, userId) {
        let conditions = {
            userId,
            subtaskId: this.id
        }
        let result = await subtasksModel.doesSubtaskExist(connection, conditions);

        if (!result) throwError({
            code: 400,
            message: `Subtask not found`
        });
    }

    async update(connection) {
        let updatePayload = {
            status: this.status
        }
        let subtaskId = [ this.id ]
        await subtasksModel.update(connection, subtaskId, updatePayload)
    }

    async updateParentTask(connection) {
        let task = await tasksModel.fetchTaskBySubTaskId(connection, this.id);
        let pendingSubtasks = task.subtasks.filter((_subtask) => !_subtask.status);

        let taskStatus;

        if (pendingSubtasks.length == 0) {
            taskStatus = "DONE"
        } else if (pendingSubtasks.length == task.subtasks.length) {
            taskStatus = "TODO"
        } else {
            taskStatus = "IN_PROGRESS";
        }

        let taskUpdatePayload = {
            status: taskStatus
        }

        await tasksModel.update(connection, taskUpdatePayload, { task_id: task.id });
    }
}

async function bulkInsert(connection, payload) {
    const dbFields = [
        `task_id`,
        `description`,
        `status`,
    ];

    return await subtasksModel.bulkInsert(connection, payload, dbFields);
}


async function update(connection, subtaskIds = [], updatePayload) {
    if (!subtaskIds.length) return;
    return await subtasksModel.update(connection, subtaskIds, updatePayload);
}

async function findSubtasksByUserId(connection, userId, conditions = {}) {
    if (!userId) throw 'User ID is required';
    return await subtasksModel.fetchSubtasksByUserId(connection, userId, conditions);
}

async function findSubtasksByTaskId(connection, taskId) {
    if (!taskId) throw 'Task ID is required';
    return await subtasksModel.fetchSubtasksByTaskId(connection, taskId);    
}

module.exports = {
    Subtask,
    bulkInsert,
    update,
    findSubtasksByUserId,
    findSubtasksByTaskId
}