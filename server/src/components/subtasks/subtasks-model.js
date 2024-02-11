const { insertQueryBuilder, updateQueryBuilder } = require("../../helpers/sql-helper");

async function bulkInsert(connection, payload, fields) {
    const tableName = `subtasks`;
    const sql = insertQueryBuilder({ tableName, fields, payload });

    return await connection.query(sql);
}

async function fetchSubtasksByTaskId(connection, taskId) {
    if (!taskId) throw 'Task ID is required';
    
    let sql = `
        SELECT
            s.id,
            s.task_id,
            s.description,
            s.status
        FROM subtasks s
        WHERE
            s.task_id = ${ connection.escape(parseInt(taskId))} AND
            s.deleted_at IS NULL
    `;
    const result = await connection.query(sql);
    return result[0]
}

async function fetchSubtasksByUserId(connection, userId, conditions) {
    if (!userId) throw 'User ID is required';
    let { taskId, status, limit, offset } = conditions;

    let sql = `
        SELECT
            s.id,
            s.task_id,
            s.description,
            s.status
        FROM subtasks s
        JOIN tasks t ON t.id = s.task_id
        WHERE
            t.user_id = ${ connection.escape(userId) } AND
            s.deleted_at IS NULL
    `;

    if (taskId) sql += ` AND
        s.task_id = ${ connection.escape(taskId) }
    `;
    if (status) sql += ` AND
        s.status = ${ connection.escape(status) }
    `;

    if (limit && offset) {
        sql += ` LIMIT ${ connection.escape(parseInt(offset)) }, ${ connection.escape(parseInt(limit)) }`;
    } else if (limit) {
        sql += ` LIMIT ${ connection.escape(parseInt(limit)) }`;
    }

    const result = await connection.query(sql);
    return result[0]
}

async function update(connection, subtaskIds = [], payload = {}) {
    if (!subtaskIds.length) return;
    const tableName = `subtasks`;

    let sql = updateQueryBuilder({ tableName, payload });
    sql += ` AND id IN (${ subtaskIds.join(`,`)})`;

    return await connection.query(sql);
}

async function doesSubtaskExist(connection, conditions) {
    const sql = `
        SELECT EXISTS (
            SELECT NULL
            FROM subtasks s
            JOIN tasks t ON t.id = s.task_id
            WHERE
                s.id = ${ connection.escape(parseInt(conditions.subtaskId)) } AND
                t.user_id = ${ connection.escape(parseInt(conditions.userId)) } AND
                s.deleted_at IS NULL
        ) AS exist;
    `;
    let result = await connection.query(sql);
    return !!result[0][0]?.exist
}

async function addDeletedAtForSubtask(connection, subtaskIds = []) {
    let sql = `DELETE FROM subtasks s WHERE s.id IN (?)`
    return await connection.query(sql, [subtaskIds])

}

module.exports = {
    bulkInsert,
    doesSubtaskExist,
    update,
    fetchSubtasksByUserId,
    fetchSubtasksByTaskId,
    addDeletedAtForSubtask
}