const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware.....
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfpjg4p.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const usersDatabase = client.db("collageDB").collection("users");
        const papresDatabase = client.db("collageDB").collection("papers");
        const collagesDatabase = client.db("collageDB").collection("collages");

        app.get('/papers', async (req, res) => {
            const cursor = papresDatabase.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/collages', async (req, res) => {
            const cursor = collagesDatabase.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        // users related apis..........................................

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email }
            const existingUser = await usersDatabase.findOne(query);

            if (existingUser) {
                return res.send({ message: 'User already exists' })
            }

            const result = await usersDatabase.insertOne(user);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello form Collage Website')
})

app.listen(port, () => {
    console.log(`The website API is runing For Collage Website Service: ${port}`)
})