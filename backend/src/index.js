const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');

const mongoose = require('mongoose');

// const dotenv = require('dotenv');

const connectDb = require('./db/db');



// dotenv.config();
require('dotenv').config({ path: '../.env' });



app.get('/', (req, res) => {
  res.send('Werlcome to the backend server of thok-bazar!');
});

const sellerRoutes = require('./routers/SellerRoutes');
const adminRoutes = require('./routers/AdminRouter');
const authrouter=require('./routers/AuthRouter');
const userRouter=require('./routers/UserRouter');
app.use(cors());
app.use(bodyParser.json());


app.use('/sellers', sellerRoutes);
app.use('/admin', adminRoutes);
app.use('/auth',authrouter);
app.use('/users',userRouter);
const ports = process.env.PORT || 5000;

app.listen(ports, async() => {
    console.log(`Server is running on port: ${ports}`);
    await connectDb();
});