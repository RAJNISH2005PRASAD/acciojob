const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Redis client
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

const store = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

// Session middleware
app.use(session({
  store,
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