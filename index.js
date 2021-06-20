const express = require('express');
const cors = require('cors');

const app = express();
require('dotenv').config()

app.use(express.json());
app.use(cors());


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylija.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const userList = client.db("jobsBoard").collection("userList");
    const jobList = client.db("jobsBoard").collection("jobList");

    app.post("/register", (req, res) => {
        console.log(req.body);
        userList.insertOne(req.body)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/userInfo', (req, res) => {
        console.log(req.query.email);
        console.log(req.body);
        userList.find({ email: req.query.email })
            .toArray((error, result) => {
                console.log(error);
                console.log(result);
                res.send(result)
            })
    })

    app.post('/addJob', (req, res) => {
        jobList.insertOne(req.body)
            .then((result) => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/allJobs', (req, res) => {
        jobList.find({})
            .toArray((error, result) => {
                console.log(error);
                console.log(result);
                res.send(result)
            })
    })

});

app.get('/', (req, res) => {
    res.send('Database connect successfully')
})

app.listen(process.env.PORT || 5000);