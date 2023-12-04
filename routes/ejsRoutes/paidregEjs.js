var express = require("express");
var router = express.Router();
const PaidRegistration= require("../../models/paidReg");
const fs = require("fs");
const qr = require("qrcode");
const upload = require("../../middleware/uploadEjs");
const { getS3Middleware } = require("../../middleware/s3client");
const getUploadMiddleware = require("../../middleware/upload");

// Import the uploadQRImageToS3 function from the S3 middleware module
const uploadQRImageToS3 = getS3Middleware(["qrImageUrl", "transactionImage"]);

/* GET home page. */
router.get("/", function (req, res, next) {
  const preFilledEmail = req.query.email;
  const preFilledName = req.query.name;
  const eventId = req.cookies.eventId;

  console.log("eventId  :", eventId);
  res.render("paidReg", { preFilledEmail, preFilledName, eventId });
});

router.post(
  "/",
  uploadQRImageToS3,
  getUploadMiddleware("deConquista/uploads/profile", [
    "qrImageUrl",
    "transactionImage",
  ]),
  getS3Middleware(["qrImageUrl", "transactionImage"]),
  async function (req, res, next) {
    try {

      // Check if a user with the same email already exists
      const existingUser = await PaidRegistration.findOne({
        email: req.body.email,
      });
      if (existingUser) {
        return res.status(400).json("Already Registered With This Mail");
      }

      // Set eventId to null if not provided in the request body
      const eventId = req.body.eventId || null;

      if (!eventId || eventId === null || eventId === "null") {
        const newRegistration = new PaidRegistration({
          name: req.body.name,
          gender: req.body.gender,
          mobileNumber: req.body.contact,
          email: req.body.email,
          district: req.body.location,
          profession: req.body.profession,
          institution: req.body.institute,
          transactionId: req.body.transactionId,
          paymentStatus: req.body.paymentStatus,
          // transactionImage: req.body.transactionImage,
          place: req.body.place,
          age: req.body.age,
          course: req.body.course,
        });

        // Generate QR code and store it
        const qrData = {
          userId: newRegistration._id,
          name: req.body.name,
          gender: req.body.gender,
          mobileNumber: req.body.contact,
          email: req.body.email,
          district: req.body.location,
          profession: req.body.profession,
          institution: req.body.institute,
          transactionId: req.body.transactionId,
          paymentStatus: req.body.paymentStatus,
          // transactionImage: req.body.transactionImage,
          place: req.body.place,
          age: req.body.age,
          course: req.body.course,
        };

        // Create the 'qrcodes' directory if it doesn't exist
        const qrCodeDirectory = "./uploads/qrcodes";
        if (!fs.existsSync(qrCodeDirectory)) {
          fs.mkdirSync(qrCodeDirectory);
        }

        // Generate the QR code and save it as a PNG file
        const qrCodeFileName = `${qrCodeDirectory}/${newRegistration._id}.png`;
        await qr.toFile(qrCodeFileName, JSON.stringify(qrData));

        // Set the QR image URL in the request body
        req.body.qrImageUrl = `uploads/qrcodes/${newRegistration._id}.png`;

        // Use the S3 middleware to upload the QR image to S3
        uploadQRImageToS3(req, res, async () => {
          // After the upload is complete, you can access the S3 URL
          const qrImageUrl = req.body.qrImageUrl;

          // Update the QR image URL in your database if needed
          newRegistration.qrImageUrl = qrImageUrl;
          await newRegistration.save();
          const userId = newRegistration._id
          const userMobile = newRegistration.mobileNumber

          // Include the QR image URL in the response JSON
          const userDataQueryString = `name=${req.body.name}&email=${req.body.email}&mobileNumber=${req.body.contact}&age=${req.body.age}&gender=${req.body.gender}&profession=${req.body.profession}&district=${req.body.location}&events=${eventId}&qrImageUrl=${qrImageUrl}`;

          // Send the query string as a JSON response
          res.json({ userDataQueryString, userId, userMobile });
        });
      } else {
        const newRegistration = new PaidRegistration({
          name: req.body.name,
          gender: req.body.gender,
          mobileNumber: req.body.contact,
          email: req.body.email,
          district: req.body.location,
          profession: req.body.profession,
          institution: req.body.institute,
          place: req.body.place,
          age: req.body.age,
          transactionId: req.body.transactionId,
          paymentStatus: req.body.paymentStatus,
          // transactionImage: req.body.transactionImage,
          course: req.body.course,
          events: eventId,
        });

        // Generate QR code and store it
        const qrData = {
          userId: newRegistration._id,
          name: req.body.name,
          gender: req.body.gender,
          mobileNumber: req.body.contact,
          email: req.body.email,
          district: req.body.location,
          profession: req.body.profession,
          institution: req.body.institute,
          place: req.body.place,
          age: req.body.age,
          transactionId: req.body.transactionId,
          paymentStatus: req.body.paymentStatus,
          // transactionImage: req.body.transactionImage,
          course: req.body.course,
          events: eventId,
        };

        // Create the 'qrcodes' directory if it doesn't exist
        const qrCodeDirectory = "./uploads/qrcodes";
        if (!fs.existsSync(qrCodeDirectory)) {
          fs.mkdirSync(qrCodeDirectory);
        }

        // Generate the QR code and save it as a PNG file
        const qrCodeFileName = `${qrCodeDirectory}/${newRegistration._id}.png`;
        await qr.toFile(qrCodeFileName, JSON.stringify(qrData));

        // Set the QR image URL in the request body
        req.body.qrImageUrl = `uploads/qrcodes/${newRegistration._id}.png`;

        // Use the S3 middleware to upload the QR image to S3
        uploadQRImageToS3(req, res, async () => {
          // After the upload is complete, you can access the S3 URL
          const qrImageUrl = req.body.qrImageUrl;

          // Update the QR image URL in your database if needed
          newRegistration.qrImageUrl = qrImageUrl;
          await newRegistration.save();
          const userId = newRegistration._id
          const userMobile = newRegistration.mobileNumber

          // Include the QR image URL in the response JSON
          const userDataQueryString = `name=${req.body.name}&email=${req.body.email}&mobileNumber=${req.body.contact}&age=${req.body.age}&gender=${req.body.gender}&profession=${req.body.profession}&district=${req.body.location}&events=${eventId}&qrImageUrl=${qrImageUrl}`;

          // Send the query string as a JSON response
          res.json({ userDataQueryString, userId, userMobile });
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
