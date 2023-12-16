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
  time: {
    type: String,
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

  link: {
    type: String,
  },
});

// Create the Event model
const Event = mongoose.model("Event", eventSchema);

// Add a virtual property to the schema to get the formatted date in IST
eventSchema.virtual('formattedDate').get(function() {
  const options = {
    timeZone: 'Asia/Kolkata', // IST timezone
    hour12: true, // 12-hour format
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return this.date.toLocaleString('en-US', options);
});

module.exports = Event;
