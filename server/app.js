const express = require(`express`);
const cors = require(`cors`);

const db = require(`./src/utils/database`);
const auth = require(`./src/utils/auth`);
const handler = require(`./src/utils/handler`);
const tasksRouter = require("./src/components/tasks/tasks-router");

const PORT = process.env.PORT;
const app = new express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(db.getConnection);

app.use(`/api/tasks`, [auth.authorizeUser], tasksRouter);

app.use(handler.errorHandler);

app.listen(PORT, ()=> {
    console.log(`Hi, I'm listening at ${ PORT }`);
});