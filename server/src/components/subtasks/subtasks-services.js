const subtasksModel = require(`./subtasks-model`)

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
}

async function bulkInsert(connection, payload) {
    const dbFields = [
        `task_id`,
        `description`,
        `status`,
    ];

    return await subtasksModel.bulkInsert(connection, payload, dbFields);

}



module.exports = {
    Subtask,
    bulkInsert
}