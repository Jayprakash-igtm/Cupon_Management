const express = require('express');
const connectDB = require('./db_config/db.js');
const dotenv = require('dotenv');
const admin = require('./routes/admin.js')
const publicApi = require('./routes/publicApi.js')
const {preventCouponAbuse} = require('./middleware/abusePrevention');
const cors = require('cors');
const session = require('express-session');
const {getClaimedcouponforUser} = require('./controller/getClaimedCoupon.js')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI);

const store = MongoStore.create({ // Create a new instance using MongoStore.create
    mongoUrl: process.env.MONGO_URI, // Pass the mongoUrl directly
    mongooseConnection: mongoose.connection,
    collectionName: 'sessions' // Optional: specify the collection name
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store, // Use the created store instance
  cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
}));

// Database Connection
connectDB()
  .then(() => {

    // Routes
    app.use('/user',preventCouponAbuse, publicApi);
    app.use('/admin', admin);
    app.get('/claimed',getClaimedcouponforUser )



    // Error handling middleware (after routes)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    // Graceful shutdown handler (after DB connection, before server starts)
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination (SIGTERM)');
        process.exit(0);
      });

    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
