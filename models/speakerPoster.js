const mongoose = require("mongoose");

const SpeakerPosterSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SpeakerPoster", SpeakerPosterSchema);
