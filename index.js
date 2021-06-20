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

    const userList = client.db("jobs-in-bd").collection("all-jobs");

    app.post("/register", (req, res) => {
        const userInfo = req.body;
        console.log(userInfo);
        userList.insertOne(userInfo)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/login', (req, res) => {
        console.log(req.query.email);
        userList.find({ email: req.query.email })
            .toArray((err, result) => {
                console.log(result);
                res.send(result[0])
            })
    })

})

app.get('/', (req, res) => {
    res.send('Database connect successfully')
})

app.listen(process.env.PORT || 5000);