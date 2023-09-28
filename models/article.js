const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
        },
        image: {
            type: String,
        },
        language: {
            type: String,
            // enum: ["English", "Arabic", "Urdu"]
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
