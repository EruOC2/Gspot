const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: String,
  imageUrl: String,
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
