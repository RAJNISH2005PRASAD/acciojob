const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  googleId: String,
  githubId: String,
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }]
});

module.exports = mongoose.model('User', userSchema); 