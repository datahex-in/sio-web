const { default: mongoose, isValidObjectId } = require("mongoose");
const PaidRegistration = require("../models/paidReg");
const dotenv = require("dotenv"); // Import dotenv
const fs = require("fs");
const axios = require("axios");
dotenv.config();
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const FormData = require("form-data");

exports.getApproved = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (isValidObjectId(userId)) {
      const user = await PaidRegistration.findOne({ _id: userId });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      } else if (user.approved == true) {
        res.status(200).json({ message: "Already Approved" });
      } else if (user.declined === true) {
        res.status(200).json({ message: "User is declined" });
      } else if (user.declined === true && user.paymentStatus === "yes"){
        const user = await PaidRegistration.findByIdAndUpdate(
          userId,
          { $set: { 
            approved: true,
            declined: false,
          } },
          { new: true } // To return the updated document
        );

        sendWhatsAppMessage(user);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
          message: "User approved successfully",
        });
      } else {
        // if (user.paymentStatus === "yes") {

          const user = await PaidRegistration.findByIdAndUpdate(
            userId,
            { $set: { 
              approved: true,
              declined: false,
            } },
            { new: true } // To return the updated document
            );
            
            sendWhatsAppMessage(user);
            
            if (!user) {
              return res.status(404).json({ error: "User not found" });
            }
            
            res.status(200).json({
              message: "User approved successfully",
            });
          // }
          // else {
          //   res.status(200).json({
          //     message: "User's payment status is No",
          //   });
          // }
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

Congratulations! We are delighted to inform you that your registration for the International Deconquista International Academic Conference has been successfully processed.

Your commitment to participating in this academic venture is greatly appreciated. We look forward to your valuable contributions and engaging discussions during the conference.

Further details regarding the schedule, speakers, and any additional information will be shared with you closer to the event date.

Should you have any questions or require assistance, feel free to reach out to this phone number or deconquista.sio@gmail.com.

Once again, congratulations on your successful registration, and we anticipate a fruitful exchange of ideas at the Deconquista International Academic Conference.
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
