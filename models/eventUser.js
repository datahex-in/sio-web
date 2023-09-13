const mongoose = require("mongoose");

const EventUserSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
        registration: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventUser", EventUserSchema);
