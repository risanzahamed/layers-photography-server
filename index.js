require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h3zxwhp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        const servicesCollection = client.db("layers-photography").collection("services")
        const myServiceCollection = client.db("layers-photography").collection("my-services")
        const myReviewCollection = client.db("layers-photography").collection("my-review")
        const bookedServiceCollection = client.db("layers-photography").collection("booked-service")

        // 3 service collections
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query).limit(3)
            const service = await cursor.toArray()
            res.send(service)
        })

        // 3 service collections
        app.get('/services-collection', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })

        // single data load api
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id : new ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })

        // Post api for my service

        app.post('/my-service', async (req, res) => {
            const service = req.body
            const result = await myServiceCollection.insertOne(service)
            res.send(result)
        })

        // Get api for my service

        app.get('/my-service', async (req, res) => {
            // console.log(req.query.email);

            let query = {}

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = myServiceCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })


        // Post api for my review

        app.post('/my-review', async (req, res) => {
            const review = req.body
            const result = await myReviewCollection.insertOne(review)
            res.send(result)
        })

        // Get api for my review

          app.get('/my-review', async(req, res)=>{
            const cursor = myReviewCollection.find({})
            const review = await cursor.toArray()
            res.send(review)
        })


        app.get('/my-add-review', async (req, res) => {
            const email = req.query.email
           
            const query = { email: email }
            const addedReview = await myReviewCollection.find(query).toArray()
            res.send(addedReview)
        })


        app.put('/update/:id',  async (req, res) => {
            const id = req.params.id;
            const editedReview = req.body.review;
            const filter = { _id: new ObjectId(id) };

            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    review: editedReview
                },
            };
            const result = await myReviewCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })


        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id:new ObjectId(id)
            };
            const result = await myReviewCollection.findOne(query);
            res.send(result);
        })

        app.delete('/my-review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            console.log('trying to delete', id);
            const result = await myReviewCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = myReviewCollection.find(query).sort({ date: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        
        app.post('/reviews/:id', async (req, res) => {
            const review = req.body;
            const result = await myReviewCollection.insertOne(review);
            res.send(result);
        })

        app.post('/booked-service', async (req, res) => {
            const jobPost = req.body
            const result = await bookedServiceCollection.insertOne(jobPost)
            res.send(result)
        })

        app.get('/my-booked-service', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const addedReview = await bookedServiceCollection.find(query).toArray()
            res.send(addedReview)
        })

    } finally {
    }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
