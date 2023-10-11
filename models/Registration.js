const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    googleId: {
      type: String,
    },
    name: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    address: {
      type: String,
    },
    district: {
      type: String,
    },
    profession: {
      type: String,
    },
    category: {
      type: String,
    },
    institution: {
      type: String,
    },
    course: {
      type: String,
    },
    // regType: {
    //     type: String,
    //     enum: ["attende", "delegate", "student"],
    // },
    regDate: {
      type: Date,
    },
    age: {
      type: Number,
    },
    place: {
      type: String,
    },
    regRef: {
      type: String,
    },
    image: {
      type: String,
    },
    qrImageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
