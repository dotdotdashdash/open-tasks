const express = require(`express`);
const subtasksController = require(`./subtasks-controller`);

const subtasksRouter = express.Router();

subtasksRouter
    .route(`/`)
    .get(subtasksController.retrieveUserSubTasks)

module.exports = subtasksRouter;



