const mongoose = require("mongoose");

// Define the Speaker schema
const speakerSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Reference to the Event model
    required: true,
  },
  photo: String,
  name: {
    type: String,
    required: true,
  },
  designation: String,
});

// Create the Speaker model
const Speaker = mongoose.model("Speaker", speakerSchema);

module.exports = Speaker;
