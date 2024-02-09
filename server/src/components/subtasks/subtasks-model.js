const { insertQueryBuilder } = require("../../helpers/sql-helper");

async function bulkInsert(connection, payload, fields) {
    const tableName = `subtasks`;
    const sql = insertQueryBuilder({ tableName, fields, payload });

    return await connection.query(sql);
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

module.exports = {
    bulkInsert,
    fetchSubtasksByUserId
}