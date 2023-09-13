const mongoose = require("mongoose");

// Define a schema for the material data
const materialSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  materialUpload: {
    type: String, 
    required: true,
  },
});

// Create the Material model using the schema
const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
