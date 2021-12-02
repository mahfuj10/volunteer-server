const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

  try {
    await client.connect();
    const database = client.db("voleenter-network");
    const collection = database.collection("voleenter-service");
    const adminCollection = database.collection("admins");
    const eventCollection = database.collection("events");


    // post api
    app.post('/service', async (req, res) => {

      const name = req.body.name;
      const email = req.body.email;
      const pic = req.files.image;
      const picData = pic.data;
      const encodedPic = picData.toString('base64');
      const imageBuffer = Buffer.from(encodedPic, 'base64');
      const vollenter = {
        name,
        email,
        image: imageBuffer
      }
      console.log(req)
      const result = await collection.insertOne(vollenter);
      res.json(result);
      // console.log(req.body)
      // const service = req.body;
      // const result = await collection.insertOne(service)
      // res.json(result);
    })

    // get api
    app.get('/service', async (req, res) => {
      const cursor = collection.find({});
      const service = await cursor.toArray();
      res.send(service);
    });

    // get single api
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleService = await collection.findOne(query);
      res.send(singleService);
    })

    //  post api 
    app.post('/admins', async (req, res) => {
      const admins = req.body;
      const result = await adminCollection.insertOne(admins);
      res.json('result');
    })

    // get api
    app.get('/admins', async (req, res) => {
      const cursor = adminCollection.find({});
      const admin = await cursor.toArray();
      res.send(admin);
    })

    // delete api
    app.delete('/admins/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await adminCollection.deleteOne(query);
      res.send(result)
    })
    // delete event
    app.delete('/admins/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await adminCollection.deleteOne(query);
      res.send(result)
    })

    // post event api
    app.post('/events', async (req, res) => {
      const event = req.body;
      const result = await eventCollection.insertOne(event);
      res.json(result);
    })

    // get event api 
    app.get('/admins/:email', async (req, res) => {
      const result = await adminCollection.find({ email: req.params.email }).toArray();
      res.send(result)

    })





  }



  finally {
    // client.close()
  }

}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})