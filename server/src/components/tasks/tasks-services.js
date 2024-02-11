const dayjs = require(`dayjs`)
const { throwError } = require(`./../../utils/handler`);
const tasksModel = require(`./tasks-model`);
const subtasksModel = require("../subtasks/subtasks-model");

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

    computeTaskPriority(date) {
        let now = dayjs(date) || dayjs();
        let dueDate = dayjs(this.dueDate);

        let daysLeft = dueDate.startOf(`day`).diff(now.startOf(`day`), `day`);

        if (daysLeft < 0) throwError({
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
            userId: this.userId,
            taskId: this.id
        }
        let result = await tasksModel.doesTaskExist(connection, conditions);
        if (!result) throwError({
            code: 400,
            message: `Task not found`
        });
    }

    async update(connection) {
        let updatePayload = {
            due_date: this.dueDate,
            status: this.status
        }
        let conditions = {
            user_id: parseInt(this.userId),
            task_id: parseInt(this.id)
        }
        await tasksModel.update(connection, updatePayload, conditions)
    }

    async updateSubtasksIfTaskDone(connection) {
        if (this.status != "DONE") return;
        let subtasksForTask = await subtasksModel.fetchSubtasksByTaskId(connection, this.id)
        if (!subtasksForTask.length) return;

        let subtaskIds = subtasksForTask.map(subtask =>  subtask.id );
        let updatePayload = { status: 1 };

        await subtasksModel.update(connection, subtaskIds, updatePayload);
    }

    async softDelete(connection) {
        if (!this.id) throw 'ID is required';
        let deletePayload = { deleted_at: new Date };
        let conditions = {
            task_id: parseInt(this.id)
        }
        return await tasksModel.update(connection, deletePayload, conditions);
    }

    async softDeleteSubTasks(connection) {
        if (!this.id) throw 'ID is required';
        let deletePayload = { deleted_at: new Date };

        return await subtasksModel.update(connection, [], deletePayload, parseInt(this.id));
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

async function updateTaskPriority(connection, date) {
    let fourDaysFromDate = dayjs(date).add(4, 'days').format(`YYYY-MM-DD`)
    let tasks = await tasksModel.findTasksDueBetweenTwoDates(connection, date, fourDaysFromDate);

    let taskPriorityObject = { 0: [], 1: [], 2: [] };

    for (let _task of tasks) {
        let task = new Task(_task);

        let newTaskPriority = task.computeTaskPriority();

        if (![0, 1, 2].includes(newTaskPriority)) continue;
        if (task.priority == newTaskPriority) continue;

        taskPriorityObject[newTaskPriority].push(task);
    }
    
    for (let priority in taskPriorityObject) {
        if(!taskPriorityObject[priority].length) continue;

        let updatePayload = { priority };
        let taskIdArray = taskPriorityObject[priority].map(task => task.id)

        console.log(`Updating priorities of tasks ${ taskIdArray.join(`, `) } to ${ priority }`)
        await tasksModel.update(connection, updatePayload, null, taskIdArray);
    }


}

module.exports = {
    Task,
    findTasksByUserId,
    bulkInsert,
    updateTaskPriority
};