const express = require(`express`);
const taskController = require(`./tasks-controller`) 


const tasksRouter = express.Router();

tasksRouter
    .route(`/`)
    .get(taskController.retrieveUserTasks)
    .post(taskController.createTaskForUser)






module.exports = tasksRouter;
