const express = require(`express`);
const taskController = require(`./tasks-controller`); 
const { authorizeUser } = require("../../utils/auth");

const tasksRouter = express.Router();

tasksRouter
    .route(`/`)
    .get(authorizeUser, taskController.retrieveUserTasks)
    .post(authorizeUser, taskController.createTasksForUser)

tasksRouter
    .route(`/:taskId/subtasks`)
    .post(authorizeUser, taskController.createSubtasksForTask)

tasksRouter
    .route(`/:taskId`)
    .put(authorizeUser, taskController.editTaskById)
    .delete(authorizeUser, taskController.softDeleteTaskById)

module.exports = tasksRouter;
