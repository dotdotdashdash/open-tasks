const mysql = require(`mysql2`)

function insertQueryBuilder(data = {}) {

    let { tableName = ``, fields = [], payload =[{}] } = data;
    if (!tableName || !fields.length || !payload.length) throw `Provide required data to build query`;

    let insertPayloadArray = []
    for (let payloadObject of payload) {
        let dataArray = [];
        for(let field of fields) {
            dataArray.push(payloadObject[field])
        }
        insertPayloadArray.push(dataArray);
    }

    let rawSql = `INSERT INTO ${ tableName } (${ fields.join(`,`) }) VALUES ?`;
    return mysql.format(rawSql, [insertPayloadArray])
}

module.exports = {
    insertQueryBuilder
}
