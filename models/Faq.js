const mongoose = require('mongoose');

// Define the FAQ schema
const faqSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model
    required: true,
  },
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
const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;
