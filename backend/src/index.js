const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDb = require('./db/db');
const corsOptions = require('./config/corsOptions');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: false });

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Werlcome to the backend server of thok-bazar!');
});
app.get('/health', (_req, res) => {
  const readyStateLookup = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const readyState = mongoose.connection.readyState;

  res.status(readyState === 1 ? 200 : 503).json({
    status: readyState === 1 ? 'ok' : 'degraded',
    database: readyStateLookup[readyState] || 'unknown',
  });
});

const sellerRoutes = require('./routers/SellerRoutes');
const adminRoutes = require('./routers/AdminRouter');
const authrouter=require('./routers/AuthRouter');
const userRouter=require('./routers/UserRouter');
const productRoutes=require('./routers/ProductRoutes');
const SellerProductRoutes=require('./routers/SellerProductRoutes');
const CartRoutes=require('./routers/CartRoutes');
const OrderRoutes=require('./routers/OrderRouter');
const sellerOrderRoutes=require('./routers/SellerOrder');
const PaymentRoutes=require('./routers/PaymentRoutes');
const TransactionRoutes=require('./routers/TransactionROutes');
const SellerReportRoutes=require('./routers/SellerReportRoutes');
const HomeCategoryRoutes=require('./routers/HomeCategoryRoutes');
const dealRoutes=require('./routers/DealRoutes');
const couponRoutes=require('./routers/CouponRoutes');
const customerAssistantRoutes=require('./routers/CustomerAssistantRoutes');

app.use('/sellers', sellerRoutes);
app.use('/admin', adminRoutes);
app.use('/auth',authrouter);
app.use('/users',userRouter);
app.use('/products', productRoutes);
app.use('/seller-products', SellerProductRoutes);
app.use('/cart',CartRoutes);
app.use('/orders',OrderRoutes);
app.use('/seller-orders',sellerOrderRoutes);
app.use('/payments',PaymentRoutes);
app.use('/transactions',TransactionRoutes);
app.use('/seller-reports',SellerReportRoutes);
app.use('/home-categories',HomeCategoryRoutes);
app.use('/deals',dealRoutes);
app.use('/coupons',couponRoutes);
app.use('/ai',customerAssistantRoutes);


const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error?.message || error);
    process.exit(1);
  }
};

startServer();
