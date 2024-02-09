const express = require(`express`);
const subtasksController = require(`./subtasks-controller`);

const subtasksRouter = express.Router();

// subtasksRouter
//     .route(`/`)
//     .get(subtasksController.retrieveUserSubTasks)
// //     .post(subtasksController.createTasksForUser)

module.exports = subtasksRouter;



