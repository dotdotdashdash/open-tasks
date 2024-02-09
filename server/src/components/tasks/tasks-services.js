const dayjs = require(`dayjs`)
const tasksModel = require(`./tasks-model`)
const handler = require(`./../../utils/handler`)

class Task {
    constructor(data = {}) {
        this.id = data.id;
        this.userId = data.user_id || data.userId ;
        this.title = data.title;
        this.description = data.description;
        this.dueDate = data.due_date || data.dueDate;
        this.status = data.status;
        this.priority = data.priority;
        this.createdAt = data.created_at || data.createdAt;
        this.updatedAt = data.updated_at || data.updatedAt;
        this.deletedAt = data.deleted_at || data.deletedAt;
    }

    parsePayloadForInsert() {
        this.insertPayload = {
            user_id: this.userId,
            title: this.title,
            description: this.description,
            due_date: this.dueDate,
            status: `TODO`,
            priority: this.computeTaskPriority()
        }
    }

    computeTaskPriority() {
        let now = dayjs();
        let dueDate = dayjs(this.dueDate);

        let daysLeft = dueDate.startOf(`day`).diff(now.startOf(`day`), `day`);

        if (daysLeft < 0) handler.throwError({
            code: 400,
            message: `Due date should be in future. Please check the due date of task with title - ${ this.title }`
        });

        if (daysLeft == 0) return 0;
        if (daysLeft >= 1 && daysLeft <= 2) return 1;
        if (daysLeft >= 3 && daysLeft <= 4) return 2;
        return 3;
    }

    async verifyTaskExistenceForUser(connection) {
        let conditions = {
            user_id: this.userId,
            task_id: this.id
        }
        return await tasksModel.doesTaskExists()
    }

}

async function findTasksByUserId(connection, userId, conditions = {}) {
    if (!userId) throw 'User ID is required';

    return await tasksModel.fetchTasksByUserId(connection, userId, conditions)
}

async function bulkInsert(connection, payload) {
    const dbFields = [
        `user_id`,
        `title`,
        `description`,
        `due_date`,
        `status`,
        `priority`
    ];

    return await tasksModel.bulkInsert(connection, payload, dbFields);
}

module.exports = {
    Task,
    findTasksByUserId,
    bulkInsert
};