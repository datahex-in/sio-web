const express = require("express");
const router = express.Router();
const PaidRegistration = require("../../models/paidReg");
const axios = require("axios");
const nodemailer = require("nodemailer");

router.get("/", async function (req, res, next) {
  const userId = req.query.userId;
  console.log({ userId });
  const preFilledName = req.query.name;
  const eventId = req.cookies.eventId;
  const userData = await PaidRegistration.findById(userId);
  console.log("userId  :", userId);
  res.render("paidRegNext", { userId, preFilledName, eventId });
});

router.post("/", async function (req, res, next) {
  try {
    const userId = req.body.userId;
    const { paymentStatus, transactionId } = req.body;

    // Construct an object with the fields you want to update
    const updateFields = {};

    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
    }

    if (transactionId) {
      updateFields.transactionId = transactionId;
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

    // Send the updated user data in the response
    sendWhatsAppMessage(updatedUser);
    //   sendConfirmationEmail(updatedUser)
    res.json({ updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function sendConfirmationEmail(existingUser) {
  console.log("Existing User", existingUser);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: existingUser.email,
    subject: `Registration Confirmation for ${existingUser.name} at Malabar Literature Festival 2023`,
    html: `<!DOCTYPE html>
      <html>
      <head>
        <style>
          .container {
              color:white;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            background-color: #05102c;
            padding: 0px;
            border: 2px solid #333;
            width: 400px;
            margin: 0 auto;
          }
          .img{
              background:white;
              width:100%;
              padding:20px;
              margin-top:5px;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
                text-decoration-line: underline;
          text-decoration-style: wavy;
          text-decoration-skip-ink: none;
          text-underline-offset: 15px;
           padding:20px;
          }
          .content {
            font-size: 16px;
            padding:20px;
          }
          .contact {
            margin-top: 0px;
             padding:20px;
          }
          .banner {
            width: 200px;
            max-height: 150px;
            object-fit: cover;
          }
          a{
              color:white;
          }
        </style>
      </head>
      <body>
        <div class="container">
        <div class="content">
        <div class="header">
          <p>Dear ${existingUser.name},</p>
        </div>
            <p>We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.</p>
      
            <p>Your participation in the Malabar Literature Festival will grant you access to a diverse range of literary discussions, author sessions, workshops, and cultural performances. We have a spectacular lineup of renowned authors, poets, and speakers who will engage in thought-provoking conversations, and we are confident that you will have an enriching and enjoyable experience.</p>
      
            <p>Please keep an eye on your email for further updates, including the festival schedule, information about speakers and sessions, and any last-minute changes. We recommend that you arrive at the venue well in advance to ensure you get the best experience possible.</p>
      
            <p>If you have any questions or require additional information, please do not hesitate to contact our support team at <a href="mailto:info@malabarliteraturefestival.com">info@malabarliteraturefestival.com</a> or call us at <a href="tel:+919539327252">+91 9539327252</a>.</p>
      
            <p>We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.</p>
      
            <p>Thank you for your participation, and best wishes for an inspiring and memorable festival!</p>
            <div class="contact">
              <p>Warm regards,<br>
              Malabar Literature Festival Organizing Committee<br>
              Help Desk: +91 9539327252</p>
            </div>
          </div>
        </div>
      </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

//   function sendWhatsAppMessage(existingUser) {
//     console.log("Existing User", existingUser);
//     let mobileNumber = String(existingUser.mobileNumber); // Convert to string

//     if (!mobileNumber.startsWith("91")) {
//       mobileNumber = "91" + mobileNumber;
//     }

//     const whatsappMessage = `Dear ${existingUser.name},

//     Congratulations! We are delighted to inform you that your registration for the International Deconquista International Academic Conference has been successfully processed.
//     Your commitment to participating in this academic venture is greatly appreciated. We look forward to your valuable contributions and engaging discussions during the conference.
//     Further details regarding the schedule, speakers, and any additional information will be shared with you closer to the event date.
//     If you have any questions or require assistance, feel free to reach out to this phone number or deconquista.sio@gmail.com.
//     Once again, congratulations on your successful registration, and we anticipate a fruitful exchange of ideas at the Deconquista International Academic Conference.

//     Best regards,
//     Director,
//     Deconquista International Academic Conference`;

//     const whatsappApiUrl = process.env.WHATSAPP_API_URL;
//     const whatsappData = {
//       number: mobileNumber,
//       type: "text",
//       message: whatsappMessage,
//       instance_id: process.env.WHATSAPP_ACCOUNT,
//       access_token: process.env.WHTSP_ACCESS_TOKEN,
//     };

//     axios
//       .post(whatsappApiUrl, whatsappData)
//       .then(function (response) {
//         console.log("WhatsApp message sent successfully:", response.data);
//       })
//       .catch(function (error) {
//         console.error("Error sending WhatsApp message:", error);
//       });
//   }

async function sendWhatsAppMessage(existingUser, req) {
  console.log("Existing User", existingUser);

  // Ensure that mobileNumber is a string
  let phoneNumber = String(existingUser.mobileNumber);

  if (!phoneNumber.startsWith("91")) {
    phoneNumber = "91" + phoneNumber;
  }

  const WhatsappMessage = `“Dear ${existingUser.name},
    Congratulations! We are delighted to inform you that your registration for the International Deconquista International Academic Conference has been successfully processed.
    Your commitment to participating in this academic venture is greatly appreciated. We look forward to your valuable contributions and engaging discussions during the conference.
    Further details regarding the schedule, speakers, and any additional information will be shared with you closer to the event date.
    If you have any questions or require assistance, feel free to reach out to this phone number or deconquista.sio@gmail.com.
    Once again, congratulations on your successful registration, and we anticipate a fruitful exchange of ideas at the Deconquista International Academic Conference.
    Best regards,
    Director,
    Deconquista International Academic conference”`;

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
