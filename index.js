const express = require("express");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;



//middlewire here
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome! To the Server...");
});
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    const productCollection = client.db("AmarDokan").collection("products");
    // perform actions on the collection object

    app.post('/addUser', async (req, res) => {
        const user = req.body;
        const { email } = user;
        usersCollection.findOne({ email }, (err, data) => {


        })
    })

    // all products
    app.get("/products", (req, res) => {
        productCollection.find({}).toArray((err, items) => {
            res.send(items);
        });
    });

    // single product by id
    app.get("/products/:id", (req, res) => {
        productCollection
            .find({ _id: ObjectID(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            });
    });

    //add all products to database
    app.post("/addProducts", (req, res) => {
        const options = { ordered: true };
        productCollection.insertMany(req.body, options).then((result) => {
            // console.log(`${result.insertedCount} documents were inserted`);
            res.send(result.insertedCount > 0);
        });
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});