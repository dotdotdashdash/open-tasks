const { insertQueryBuilder } = require("../../helpers/sql-helper");

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
    return result[0]
}

async function bulkInsert(connection, payload, fields) {
    const tableName = `tasks`;
    const sql = insertQueryBuilder({tableName, fields, payload});

    return await connection.query(sql);
}

async function doesTaskExists(connection, conditions) {

}

module.exports = {
    fetchTasksByUserId,
    doesTaskExists,
    bulkInsert
}