const mongoose = require("mongoose");

const paidRegistrationSchema = new mongoose.Schema(
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
    whatsapp: {
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
    paymentStatus: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    transactionImage: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
    paymentScreenshotStatus: {
      type: String,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    declined: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaidRegistration", paidRegistrationSchema);
