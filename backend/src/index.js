const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const connectDb = require('./db/db');



app.get('/', (req, res) => {
  res.send('Werlcome to the backend server of thok-bazar!');
});

const sellerRoutes = require('./routers/SellerRoutes');
const adminRoutes = require('./routers/AdminRouter');
app.use(cors());
app.use(bodyParser.json());


app.use('api/sellers', sellerRoutes);
app.use('api/admin', adminRoutes);

const ports = process.env.PORT || 5000;

app.listen(ports, async() => {
    console.log(`Server is running on port: ${ports}`);
    await connectDb();
});