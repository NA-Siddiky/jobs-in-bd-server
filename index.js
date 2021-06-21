const express = require('express');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID
const app = express();
require('dotenv').config()

app.use(express.json());
app.use(cors());


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylija.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const userList = client.db("jobs-in-bd").collection("all-users");
    const jobList = client.db("jobs-in-bd").collection("all-jobs");
    const categoryList = client.db("jobs-in-bd").collection("category-list");

    app.post("/register", (req, res) => {
        const userInfo = req.body;
        console.log(userInfo);
        userList.insertOne(userInfo)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/userInfo', (req, res) => {
        console.log(req.query.email);
        userList.find({ email: req.query.email })
            .toArray((err, result) => {
                console.log(result);
                res.send(result[0])
            })
    })

    app.post('/addJob', (req, res) => {
        jobList.insertOne(req.body)
            .then((result) => {
                console.log(result);
            })
    })

    app.get('/allJobs', (req, res) => {
        jobList.find({})
            .toArray((err, result) => {
                console.log(err, result);
                res.send(result)
            })
    })

    app.patch('/update/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        const body = req.body

        console.log(id, body);

        jobList.findOneAndUpdate(
            { _id: id },
            { $set: { status: body.status } }
        )
            .then(result => {
                console.log(result);
                res.send(result.ok > 0)
            })
            .catch(err => {
                console.log(err);
            })
    })

    app.post('/addCategory', (req, res) => {
        console.log(req.body);
        categoryList.insertOne(req.body)
            .then(result => {
                console.log(result);
            })
    })

    app.get('/category', (req, res) => {
        categoryList.find({})
            .toArray((err, result) => {
                res.send(result)
            })
    })

})

app.get('/', (req, res) => {
    res.send('Database connect successfully')
})

app.listen(process.env.PORT || 5000);