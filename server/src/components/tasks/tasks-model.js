const { insertQueryBuilder, updateQueryBuilder } = require("../../helpers/sql-helper");

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

async function doesTaskExist(connection, conditions) {
    const sql = `
        SELECT EXISTS (
            SELECT NULL 
            FROM tasks t
            WHERE
                t.id = ${ connection.escape(parseInt(conditions.taskId)) } AND
                t.user_id = ${ connection.escape(parseInt(conditions.userId)) }
        ) AS exist;
    `;
    let result = await connection.query(sql);
    return !!result[0][0]?.exist
}

async function update(connection, payload, conditions) {
    const tableName = `tasks t`;
    let sql = updateQueryBuilder({ tableName, payload });
    
    sql += ` 
        AND t.user_id = ${ connection.escape(conditions.user_id)}
        AND t.id = ${ connection.escape(conditions.task_id)}
    `;    

    console.log(`\n\n>>>>>------${new Date().toLocaleTimeString('en-us',{ timeZone: 'Asia/Calcutta', hour: '2-digit', minute: '2-digit', second: '2-digit',  fractionalSecondDigits: 3 })}------->>\n | file: tasks-model.js:69 | update | sql::`, sql);

    return await connection.query(sql);
}

module.exports = {
    fetchTasksByUserId,
    doesTaskExist,
    bulkInsert,
    update
}