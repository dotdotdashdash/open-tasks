const { insertQueryBuilder, updateQueryBuilder } = require("../../helpers/sql-helper");

async function fetchTaskBySubTaskId(connection, subtaskId) {
    if (!subtaskId) throw `Subtask ID is required`;

    let sql = `
        SELECT
            t.id,
            t.title,
            t.description,
            t.due_date,
            t.status,
            t.priority,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', s.id,
                        'description', s.description,
                        'status', s.status
                    )
                ) AS subtasks
                FROM subtasks s
                WHERE s.task_id = t.id
            ) AS subtasks
        FROM tasks t
        WHERE t.id = (
            SELECT task_id 
            FROM subtasks
            WHERE id = ${ connection.escape(subtaskId) }
        ) AND
        t.deleted_at IS NULL 
    `;
    const result = await connection.query(sql)
    return result[0][0];
}
async function fetchTasksByUserId(connection, userId, conditions) {
    if (!userId) throw 'User ID is required';
    let { priority, dueDate, limit, offset } = conditions

    let sql = `
        SELECT 
            id,
            title,
            description,
            due_date,
            status,
            priority
        FROM tasks t
        WHERE
            t.user_id = ${ connection.escape(userId) } AND
            t.deleted_at IS NULL
    `;

    if (priority) sql += ` AND
        priority = ${ connection.escape(priority) }
    `;
    if (dueDate) sql += ` AND
        DATE(due_date) = DATE(${ connection.escape(dueDate) })
    `;

    if (limit && offset) {
        sql += ` LIMIT ${ connection.escape(parseInt(offset)) }, ${ connection.escape(parseInt(limit)) }`;
    } else if (limit) {
        sql += ` LIMIT ${ connection.escape(parseInt(limit)) }`;
    }


    const result = await connection.query(sql);
    return result[0];
}

async function bulkInsert(connection, payload, fields) {
    const tableName = `tasks`;
    const sql = insertQueryBuilder({tableName, fields, payload});

    return await connection.query(sql);
}

async function doesTaskExist(connection, conditions) {
    const sql = `
        SELECT EXISTS (
            SELECT NULL 
            FROM tasks t
            WHERE
                t.id = ${ connection.escape(parseInt(conditions.taskId)) } AND
                t.user_id = ${ connection.escape(parseInt(conditions.userId)) } AND
                t.deleted_at IS NULL
        ) AS exist;
    `;
    let result = await connection.query(sql);
    return !!result[0][0]?.exist
}

async function update(connection, payload, conditions, taskIdArray = []) {
    const tableName = `tasks t`;
    let sql = updateQueryBuilder({ tableName, payload });

    if (taskIdArray.length) {
        sql += ` AND t.id IN (${ taskIdArray.join(`,`)})`
    } else if (conditions) {
        sql += ` AND t.id = ${ connection.escape(conditions.task_id)}`;
    } else {
        throw `task ID required`
    }
    return await connection.query(sql);
}

async function findTasksDueBetweenTwoDates(connection, startDate, endDate) {
    if (!startDate || !endDate) throw `Date required`;

    const sql = `
        SELECT
            id,
            user_id,
            title,
            description,
            due_date,
            status, 
            priority
        FROM tasks
        WHERE
            DATE(due_date) >= DATE("${ startDate }") AND
            DATE(due_date) <= DATE("${ endDate }") AND
            deleted_at IS NULL
        ORDER BY due_date ASC
    `;
    let res = await connection.query(sql);
    return res[0];
}

async function getUserInformation(connection, userIds = []) {
    if (!userIds.length) throw `ID required`;

    const sql = `
        SELECT
            id,
            name,
            phone_number,
            calling_priority
        FROM users
        WHERE id IN (${ userIds.join(`,`)});
    `;
    let res = await connection.query(sql);
    return res[0];

}

module.exports = {
    fetchTasksByUserId,
    fetchTaskBySubTaskId,
    findTasksDueBetweenTwoDates,
    getUserInformation,
    doesTaskExist,
    bulkInsert,
    update
}