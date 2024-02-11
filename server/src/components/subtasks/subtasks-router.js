const express = require(`express`);
const subtasksController = require(`./subtasks-controller`);

const subtasksRouter = express.Router();

subtasksRouter
    .route(`/`)
    .get(subtasksController.retrieveUserSubTasks)

subtasksRouter
    .route(`/:subtaskId`)
    .put(subtasksController.editSubtaskById)
    .delete(subtasksController.deleteSubtaskById)


module.exports = subtasksRouter;