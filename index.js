const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 8021;



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnv3d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const ProductsCollection = client.db("groceryStore").collection("products");
    const ordersCollection = client.db("groceryStore").collection("orders");

    app.post('/addProduct', (req,res) => {
        const newProduct = req.body;
        ProductsCollection.insertOne(newProduct)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
      })

      app.get('/products', (req, res) => {
        ProductsCollection.find()
        .toArray((err, items) => {
          res.send(items);
        })
      }) 

      app.get('/singleProduct/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        ProductsCollection.find({_id: id})
        .toArray((err, documents) => {
           res.send(documents[0])
        })
   
       })

      app.delete('/deleteItem/:id', (req,res) =>{
        const id = ObjectID(req.params.id);
        ProductsCollection.findOneAndDelete({_id: id})
        .then(result => {
          res.send(result.deletedCount > 0);
        })
     })

      app.post('/orderProduct', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/buyerDetails', (req, res) => {
      ordersCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.status(200).send(documents);
      })
   })

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })