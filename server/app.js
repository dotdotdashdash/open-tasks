// require('dotenv/config');
const express = require(`express`);
const cors = require(`cors`);

const db = require(`./src/utils/db`);
const { errorHandler } = require(`./src/utils/error-handler`)


const PORT = process.env.PORT;

const app = new express();


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(db.getConnection)


app.get(`/`, (req, res)=> {
    res.send(`Workinggggggg`)
});

app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Hi, I'm listening at ${PORT}`);
});