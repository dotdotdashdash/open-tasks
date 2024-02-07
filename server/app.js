// require('dotenv/config');
const express = require(`express`);
const cors = require(`cors`);

const er = require(`./src/utils/error-handler`);
const db = require(`./src/utils/db`);
const tasksRouter = require("./src/components/tasks/tasks-router");

const PORT = process.env.PORT;
const app = new express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(db.getConnection);

app.use(`/api/tasks`, tasksRouter);

app.use(er.errorHandler);

app.listen(PORT, ()=> {
    console.log(`Hi, I'm listening at ${ PORT }`);
});