const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    mobileNumber: {
      type: String,
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
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
