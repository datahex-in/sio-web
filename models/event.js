const mongoose = require("mongoose");

// Define the event schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: String,
  shortDescription: String,
  description: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  venue: String,
  date: {
    type: Date,
    required: true,
  },
  eventMode: {
    type: String,
    enum: ["Online", "Offline", "Hybrid"],
  },
  month: {
    type: String,
    enum: ["September", "October", "November", "December"],
  },

  isEnroll: Boolean,

  headerImage: {
    type: String,
  },

  eventType: {
    type: String,
    enum: [
      "Seminar",
      "Workshop",
      "Public Discussion",
      "Reading Session",
      "Academic Conference",
      "Book Talks",
      "Online Academic Conclaves",
    ],
    required: true,
  },
});

// Create the Event model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
