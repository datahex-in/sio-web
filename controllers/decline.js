const { default: mongoose, isValidObjectId } = require("mongoose");
const PaidRegistration = require("../models/paidReg");
const dotenv = require("dotenv"); // Import dotenv
const fs = require("fs");
const axios = require("axios");
dotenv.config();
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const FormData = require("form-data");

exports.getDeclined = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (isValidObjectId(userId)) {
      const user = await PaidRegistration.findOne({ _id: userId });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      } else if (
        user.approved === true ||
        user.paymentStatus === "yes" ||
        user.paymentStatus === "no"
      ) {
        const updatedUser = await PaidRegistration.findByIdAndUpdate(
          userId,
          {
            $set: {
              approved: false,
              paymentStatus: null,
              declined: true,
              paymentScreenshotStatus: null,
              // $unset: { paymentScreenshotStatus: 1 }, // Remove transactionId
            },
          },
          { new: true } // To return the updated document
        );

        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }

        console.log(updatedUser);
        sendWhatsAppMessage(updatedUser);
        res.status(200).json({
          message: "User declined successfully",
        });
      } else if (user.declined === true) {
        res.status(200).json({ message: "Already Declined" });
      } else {
        const updatedUser = await PaidRegistration.findByIdAndUpdate(
          userId,
          {
            $set: {
              approved: false,
              paymentStatus: null,
              declined: true,
              paymentScreenshotStatus: null,
            },
          },
          { new: true } // To return the updated document
        );
        sendWhatsAppMessage(updatedUser);
        res.status(200).json({ message: "User declined" });
      }
    } else {
      return res.status(404).json({ error: "Invalid User" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function sendWhatsAppMessage(existingUser, req) {
  // Ensure that mobileNumber is a string
  let phoneNumber = String(existingUser.whatsapp);

  if (!phoneNumber.startsWith("91")) {
    phoneNumber = "91" + phoneNumber;
  }

  const WhatsappMessage = `Dear ${existingUser.name},

Congratulations on completing the registration form for the Deconquista International Academic Conference on 22nd-24th December in Kozhikode! *Please note that your registration will be fulfilled only upon successful payment. Kindly proceed with payment through g pay number 7558838799 or UPI id Ibnshameer01@oksbi and send the screenshot to this WhatsApp number to secure your spot.*
  
If you have any questions or need assistance, please don't hesitate to contact us either by phone to this number or through deconquista.sio@gmail.com. Thank you for your participation!
  
Join this group for updates and news.
  
https://chat.whatsapp.com/HCPIwmjcuXDC1I9ZZWQEY1
  
Best regards,
  
Director,
Deconquista International Academic Conference`.replace(/\n\s*\n\s*/g, "\n\n");

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
