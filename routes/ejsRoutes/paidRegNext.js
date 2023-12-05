const express = require("express");
const router = express.Router();
const PaidRegistration = require("../../models/paidReg");
const axios = require("axios");
const nodemailer = require("nodemailer");

router.get("/", async function (req, res, next) {
  const userId = req.query.userId;
  res.render("paidRegNext", { userId });
});

router.post("/", async function (req, res, next) {
  try {
    const userId = req.body.userId;
    const { paymentStatus, paymentScreenshotStatus } = req.body;

    // Construct an object with the fields you want to update
    const updateFields = {};

    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
    }

    if (paymentScreenshotStatus) {
      updateFields.paymentScreenshotStatus = paymentScreenshotStatus;
    }

    // Use findByIdAndUpdate to update the user document with specific fields
    const updatedUser = await PaidRegistration.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (updatedUser.paymentStatus === "no") {
      // Send the updated user data in the response
      sendWhatsAppMessage(updatedUser);
    }
    res.json({ updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function sendWhatsAppMessage(existingUser, req) {
  // Ensure that mobileNumber is a string
  let phoneNumber = String(existingUser.whatsapp);

  if (!phoneNumber.startsWith("91")) {
    phoneNumber = "91" + phoneNumber;
  }

const WhatsappMessage = `Dear ${existingUser.name},
Congratulations on completing the registration form for the Deconquista International Academic Conference on 22nd-24th December in Kozhikode! Please note that your registration will be fulfilled only upon successful payment. Kindly proceed with payment using the details provided to secure your spot. 
If you have any questions or need assistance, please don't hesitate to contact us either by phone to this number or through deconquista.sio@gmail.com.
Thank you for your participation!
 
Best regards
Director
Deconquista international academic conference`;

  const data = new FormData();
  data.append("type", "text");
  data.append("message", WhatsappMessage);
  data.append("recipient", phoneNumber);
  data.append("account", process.env.WHATSAPP_ACCOUNT);
  data.append("secret", process.env.WHTSP_ACCESS_TOKEN);

  let config = {
    method: "post",
    url: "https://text.dxing.tech/api/send/whatsapp",
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = router;
