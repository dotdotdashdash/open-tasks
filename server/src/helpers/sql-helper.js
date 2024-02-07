const mysql = require(`mysql2`)

function insertQueryBuilder(tableName = ``, dbFieldsArray = [], payloadObjectArray =[{}]) {
    if (!tableName || !dbFieldsArray.length || !payloadObjectArray.length) throw `Provide required data to build query`;

    let insertPayloadArray = []
    for (let payloadObject of payloadObjectArray) {
        let dataArray = [];
        for(let field of dbFieldsArray) {
            dataArray.push(payloadObject[field])
        }
        insertPayloadArray.push(dataArray);
    }

    let rawSql = `INSERT INTO ${ tableName } (${ dbFieldsArray.join(`,`) }) VALUES ?` 
    return mysql.format(rawSql, [insertPayloadArray])
}

module.exports = {
    insertQueryBuilder
}
