const mongoose = require("mongoose");

const LeadersNoteSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        designation: {
            type: String,
        },
        image: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LeadersNote", LeadersNoteSchema);
