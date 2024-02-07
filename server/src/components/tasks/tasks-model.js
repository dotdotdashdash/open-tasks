const { insertQueryBuilder } = require("../../helpers/sql-helper");


async function fetchTasksByUserId(connection, userId) {
    if (!userId) throw 'User ID is required';
    const sql = `
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
    const result = await connection.query(sql);
    return result[0]
}

async function bulkInsert(connection, payload, fields) {
    const tableName = `tasks`;
    const sql = insertQueryBuilder(tableName, fields, payload)

    const result = await connection.query(sql)

}

module.exports = {
    fetchTasksByUserId,
    bulkInsert
}