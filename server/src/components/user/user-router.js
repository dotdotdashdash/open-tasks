const express = require(`express`);
const userController = require(`./user-controller`);

const userRouter = express.Router();

userRouter
    .route(`/login`)
    .post(userController.logInUser)

module.exports = userRouter;