require(`./src/utils/cron-jobs`)

const express = require(`express`);
const cors = require(`cors`);

const db = require(`./src/utils/database`);
const auth = require(`./src/utils/auth`);
const handler = require(`./src/utils/handler`);
const tasksRouter = require("./src/components/tasks/tasks-router");
const subtasksRouter = require("./src/components/subtasks/subtasks-router");
const userRouter = require("./src/components/user/user-router");
const { debugCronJobRoutines } = require("./src/utils/scheduler");

const PORT = process.env.PORT;
const app = new express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(db.setupConnection);

app.use(`/v1/api/user/tasks`, tasksRouter);
app.use(`/v1/api/user/subtasks`, subtasksRouter);
app.use(`/v1/api/user`,  userRouter);
app.use(`/v1/api/debug/cronjobs`, [auth.authorizeUser], debugCronJobRoutines )

app.use(handler.errorHandler);

app.listen(PORT, ()=> {
    console.log(`Hi, I'm listening at ${ PORT }`);
});