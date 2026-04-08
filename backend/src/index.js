const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDb = require('./db/db');
const corsOptions = require('./config/corsOptions');
const { requestLogger, logInfo, logWarn } = require('./util/requestTrace');

const isHostedRuntime = () =>
  [
    process.env.RENDER,
    process.env.VERCEL,
    process.env.RAILWAY_ENVIRONMENT,
    process.env.FLY_APP_NAME,
    process.env.K_SERVICE,
    process.env.WEBSITE_SITE_NAME,
    process.env.DYNO,
  ].some(Boolean);

const shouldLoadLocalEnvFiles =
  String(process.env.NODE_ENV || '').trim().toLowerCase() !== 'production' && !isHostedRuntime();

const localEnvFiles = [
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, '../../.env.local'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
];

if (shouldLoadLocalEnvFiles) {
  localEnvFiles.forEach((envFilePath) => {
    dotenv.config({ path: envFilePath, override: false, quiet: true });
  });
}

const readyStateLookup = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

const getDatabaseStatus = () => readyStateLookup[mongoose.connection.readyState] || 'unknown';

const toPositiveInteger = (value, fallbackValue) => {
  const parsedValue = Number.parseInt(String(value || '').trim(), 10);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return fallbackValue;
};

app.set('trust proxy', true);
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('Werlcome to the backend server of thok-bazar!');
});
app.get('/health', (_req, res) => {
  const readyState = mongoose.connection.readyState;

  res.status(200).json({
    status: readyState === 1 ? 'ok' : 'degraded',
    database: getDatabaseStatus(),
  });
});

const sellerRoutes = require('./routers/SellerRoutes');
const adminRoutes = require('./routers/AdminRouter');
const authrouter = require('./routers/AuthRouter');
const userRouter = require('./routers/UserRouter');
const productRoutes = require('./routers/ProductRoutes');
const SellerProductRoutes = require('./routers/SellerProductRoutes');
const CartRoutes = require('./routers/CartRoutes');
const OrderRoutes = require('./routers/OrderRouter');
const sellerOrderRoutes = require('./routers/SellerOrder');
const PaymentRoutes = require('./routers/PaymentRoutes');
const TransactionRoutes = require('./routers/TransactionROutes');
const SellerReportRoutes = require('./routers/SellerReportRoutes');
const HomeCategoryRoutes = require('./routers/HomeCategoryRoutes');
const dealRoutes = require('./routers/DealRoutes');
const couponRoutes = require('./routers/CouponRoutes');
const customerAssistantRoutes = require('./routers/CustomerAssistantRoutes');

app.use('/sellers', sellerRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authrouter);
app.use('/users', userRouter);
app.use('/products', productRoutes);
app.use('/seller-products', SellerProductRoutes);
app.use('/cart', CartRoutes);
app.use('/orders', OrderRoutes);
app.use('/seller-orders', sellerOrderRoutes);
app.use('/payments', PaymentRoutes);
app.use('/transactions', TransactionRoutes);
app.use('/seller-reports', SellerReportRoutes);
app.use('/home-categories', HomeCategoryRoutes);
app.use('/deals', dealRoutes);
app.use('/coupons', couponRoutes);
app.use('/ai', customerAssistantRoutes);

const port = toPositiveInteger(process.env.PORT, 5000);
const dbRetryDelayMs = toPositiveInteger(process.env.MONGODB_RETRY_DELAY_MS, 5000);
let dbReconnectTimer = null;
let dbConnectPromise = null;

const scheduleDatabaseReconnect = () => {
  if (dbReconnectTimer) {
    return;
  }

  dbReconnectTimer = setTimeout(() => {
    dbReconnectTimer = null;
    void ensureDatabaseConnection();
  }, dbRetryDelayMs);

  if (typeof dbReconnectTimer.unref === 'function') {
    dbReconnectTimer.unref();
  }
};

const ensureDatabaseConnection = async () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return dbConnectPromise;
  }

  if (dbConnectPromise) {
    return dbConnectPromise;
  }

  dbConnectPromise = connectDb()
    .catch((error) => {
      logWarn('MongoDB unavailable; HTTP server will stay online and retry.', {
        database: getDatabaseStatus(),
        errorMessage: error?.message || String(error),
        retryInMs: dbRetryDelayMs,
      });
      scheduleDatabaseReconnect();
      return null;
    })
    .finally(() => {
      dbConnectPromise = null;
    });

  return dbConnectPromise;
};

mongoose.connection.on('disconnected', () => {
  logWarn('MongoDB disconnected.', {
    database: getDatabaseStatus(),
    retryInMs: dbRetryDelayMs,
  });
  scheduleDatabaseReconnect();
});

mongoose.connection.on('error', (error) => {
  logWarn('MongoDB connection error.', {
    database: getDatabaseStatus(),
    errorMessage: error?.message || String(error),
  });
});

const startServer = () => {
  try {
    logInfo('Backend configuration snapshot', {
      emailFromConfigured: Boolean(String(process.env.SMTP_FROM || process.env.EMAIL_FROM || "").trim()),
      emailUserConfigured: Boolean(String(process.env.SMTP_USER || process.env.EMAIL_USER || "").trim()),
      frontendUrl: String(process.env.FRONTEND_URL || "").trim() || null,
      googleClientConfigured: Boolean(String(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_IDS || "").trim()),
      nodeEnv: process.env.NODE_ENV || 'development',
      port,
      smtpHost: String(process.env.SMTP_HOST || "").trim() || 'smtp.gmail.com (derived from EMAIL_USER when Gmail is used)',
      smtpPort: String(process.env.SMTP_PORT || "").trim() || null,
      smtpSecure: String(process.env.SMTP_SECURE || "").trim() || null,
    });

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port: ${port}`);
      void ensureDatabaseConnection();
    });

    server.on('error', (error) => {
      console.error('Failed to bind backend HTTP server:', error?.message || error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start backend:', error?.message || error);
    process.exit(1);
  }
};

startServer();
