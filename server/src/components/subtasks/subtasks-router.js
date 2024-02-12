const express = require(`express`);
const subtasksController = require(`./subtasks-controller`);
const { authorizeUser } = require("../../utils/auth");

const subtasksRouter = express.Router();

subtasksRouter
    .route(`/`)
    .get(authorizeUser, subtasksController.retrieveUserSubTasks)

subtasksRouter
    .route(`/:subtaskId`)
    .put(authorizeUser, subtasksController.editSubtaskById)
    .delete(authorizeUser, subtasksController.softDeleteSubtaskById)


module.exports = subtasksRouter;