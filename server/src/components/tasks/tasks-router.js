const express = require(`express`);
const jwt = require('jsonwebtoken');
const userController = require(`./tasks-controller`)

const tasksRouter = express.Router();

tasksRouter.get(`/`, async (req, res, next)=> {
    try {
        console.log(`------------+++++++++++`)
        const connection = req.connection;
        let sql = `select 1`
        console.log(`before result`)

        let result = await connection.query(sql);

        console.log(`resulttt`, result)

        res
            .status(200)
            .json({
                status: 200,
                success: true,
                message: `tasks is working`
            });
    } catch (error) {
        next(error)
    }
});

module.exports = tasksRouter;
