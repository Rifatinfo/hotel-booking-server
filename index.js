require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json());
const port = process.env.port || 5000


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.i1uhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    await client.connect();

    // Hotel-Booking
    // all-booking-info

    const hotelBookCollection = client.db("Hotel-Booking").collection("all-booking-info"); 
    const hotelCartCollection = client.db("Hotel-Booking").collection("booking-cart"); 
    app.get('/all-booking-info', async (req, res) => {
      const result = await hotelBookCollection.find().toArray();
      res.send(result)
    })
   
    app.post('/carts' , async (req, res) => {
     const cartItem = req.body;
     const result = await hotelCartCollection.insertOne(cartItem)
     res.send(result);
    })

    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = {email : email}
      const result = await hotelCartCollection.find(query).toArray();
      res.send(result);
    })
    
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await hotelCartCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hotel Booking System!')
})

app.listen(port, () => {
  console.log(`Hotel Booking System on port ${port}`)
})