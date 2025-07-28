const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
// const { RedisStore } = require('connect-redis');
// const { createClient } = require('redis');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration to allow multiple origins
const allowedOrigins = [
  'http://localhost:5173', // local development
  'https://acciojob-red.vercel.app', // deployed frontend
  process.env.FRONTEND_URL // from environment variable
].filter(Boolean); // remove any undefined values

app.use(cors({ 
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(express.json());

// MongoDB connection (removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Redis client (temporarily disabled to fix connection errors)
// const redisClient = createClient({ url: process.env.REDIS_URL });
// redisClient.connect().catch(console.error);

// const store = new RedisStore({
//   client: redisClient,
//   prefix: 'sess:',
// });

// Session middleware (using memory store instead of Redis for now)
app.use(session({
  // store, // Redis store disabled
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

// Passport config (to be added)
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/session');
const aiRoutes = require('./routes/ai');

app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/ai', aiRoutes);
app.get('/', (req, res) => res.send('API Running'));

module.exports = app; 