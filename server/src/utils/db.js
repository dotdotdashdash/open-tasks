const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST_IP,
    connectionLimit: 3,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}); 

function getConnection(req, res, next) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            else resolve(connection)
        })
    })
    .then((connection) => {
        console.log(`MySQL connection obtained`)
        req['connection'] = connection;
        next()
    })
    .catch((err) => {
        console.log(`MySQL connection failed`)
        next(err)
    })
}

module.exports = { getConnection }
