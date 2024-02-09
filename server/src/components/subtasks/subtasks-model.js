const { insertQueryBuilder } = require("../../helpers/sql-helper");


async function bulkInsert(connection, payload, fields) {
    const tableName = `subtasks`;
    const sql = insertQueryBuilder(tableName, fields, payload);

    return await connection.query(sql);
}
module.exports = { bulkInsert }