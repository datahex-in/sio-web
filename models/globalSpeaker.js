const mongoose = require("mongoose");

// Define the Speaker schema
const speakerSchema = new mongoose.Schema({
  photo: String,
  name: {
    type: String,
    required: true,
  },
  designation: String,
});

// Create the Speaker model
const GlobalSpeaker = mongoose.model("GlobalSpeaker", speakerSchema);

module.exports = GlobalSpeaker;
