const mongoose = require("mongoose");

const EventAttendanceSchema = new mongoose.Schema(
  {
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
    attended: {
      type: Boolean,
      default: false,
    },
    attendedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventAttendance", EventAttendanceSchema);
