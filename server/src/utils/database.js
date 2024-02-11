const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST_IP,
    connectionLimit: 4,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}); 

async function setupConnection(req, res, next) {
    await getConnection(req);
    await releaseConnectionAfterSendingResponse(req, res);
    next()

}

async function getConnection(req) {
    req.locals = {};
    req.locals.connection = await pool.getConnection()
}

async function releaseConnectionAfterSendingResponse(req, res) {
    res.on('finish', async () => {
        req.locals.connection.release()
    });
}

module.exports = {
    setupConnection,
    dbPool: pool
}
