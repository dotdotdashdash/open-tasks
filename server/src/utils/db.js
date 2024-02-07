const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST_IP,
    connectionLimit: 4,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}); 

function getConnection(req, res, next) {
    req.connection = pool.promise();
    console.log(`MySQL connection obtained`)
    next();
}

module.exports = { getConnection }
