const mongoose = require('mongoose');

// Define the FAQ schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

// Create the FAQ model
const GlobalFAQ = mongoose.model('GlobalFAQ', faqSchema);

module.exports = GlobalFAQ;
