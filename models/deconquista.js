const mongoose = require("mongoose");

const DeconquistaSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deconquista", DeconquistaSchema);
