var express = require("express");
var router = express.Router();
const Registration = require("../../models/Registration");
const fs = require("fs");
const qr = require("qrcode");

/* GET home page. */
router.get("/", function (req, res, next) {
  const preFilledEmail = req.query.email;
  const preFilledName = req.query.name;
  const eventId = req.cookies.eventId;

  console.log("eventId  :", eventId);
  res.render("register", { preFilledEmail, preFilledName, eventId });
});

router.post("/", async function (req, res, next) {
  try {
    console.log(req.body);

    // Check if a user with the same email already exists
    const existingUser = await Registration.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json("Already Registered With This Mail");
    }

    // Set eventId to null if not provided in the request body
    const eventId = req.body.eventId || null;

    if (!eventId || eventId === null || eventId === "null") {
      const newRegistration = new Registration({
        name: req.body.name,
        gender: req.body.gender,
        mobileNumber: req.body.contact,
        email: req.body.email,
        district: req.body.location,
        profession: req.body.profession,
        institution: req.body.institute,
        place: req.body.place,
        age: req.body.age,
        course: req.body.course,
      });

      // Generate QR code and store it
      const qrData = {
        name: req.body.name,
        gender: req.body.gender,
        mobileNumber: req.body.contact,
        email: req.body.email,
        district: req.body.location,
        profession: req.body.profession,
        institution: req.body.institute,
        place: req.body.place,
        age: req.body.age,
        course: req.body.course,
      };

      // Create the 'qrcodes' directory if it doesn't exist
      const qrCodeDirectory = "./public/qrcodes";
      if (!fs.existsSync(qrCodeDirectory)) {
        fs.mkdirSync(qrCodeDirectory);
      }

      // Generate the QR code and save it as a PNG file
      const qrCodeFileName = `${qrCodeDirectory}/${newRegistration._id}.png`;
      await qr.toFile(qrCodeFileName, JSON.stringify(qrData));

      // Add QR image URL to the registration data
      const qrImageUrl = `/qrcodes/${newRegistration._id}.png`;
      newRegistration.qrImageUrl = qrImageUrl;

      await newRegistration.save();

      // Include the QR image URL in the response JSON
      const userDataQueryString = `name=${req.body.name}&email=${req.body.email}&mobileNumber=${req.body.contact}&age=${req.body.age}&gender=${req.body.gender}&profession=${req.body.profession}&district=${req.body.location}&qrImageUrl=${qrImageUrl}`;

      // Send the query string as a JSON response
      res.json({ userDataQueryString });
    } else {
      const newRegistration = new Registration({
        name: req.body.name,
        gender: req.body.gender,
        mobileNumber: req.body.contact,
        email: req.body.email,
        district: req.body.location,
        profession: req.body.profession,
        institution: req.body.institute,
        place: req.body.place,
        age: req.body.age,
        course: req.body.course,
        events: eventId,
      });

      // Generate QR code and store it
      const qrData = {
        name: req.body.name,
        gender: req.body.gender,
        mobileNumber: req.body.contact,
        email: req.body.email,
        district: req.body.location,
        profession: req.body.profession,
        institution: req.body.institute,
        place: req.body.place,
        age: req.body.age,
        course: req.body.course,
        events: eventId,
      };

      // Create the 'qrcodes' directory if it doesn't exist
      const qrCodeDirectory = "./public/qrcodes";
      if (!fs.existsSync(qrCodeDirectory)) {
        fs.mkdirSync(qrCodeDirectory);
      }

      // Generate the QR code and save it as a PNG file
      const qrCodeFileName = `${qrCodeDirectory}/${newRegistration._id}.png`;
      await qr.toFile(qrCodeFileName, JSON.stringify(qrData));

      // Add QR image URL to the registration data
      const qrImageUrl = `/qrcodes/${newRegistration._id}.png`;
      newRegistration.qrImageUrl = qrImageUrl;

      await newRegistration.save();

      // Include the QR image URL in the response JSON
      const userDataQueryString = `name=${req.body.name}&email=${req.body.email}&mobileNumber=${req.body.contact}&age=${req.body.age}&gender=${req.body.gender}&profession=${req.body.profession}&district=${req.body.location}&events=${eventId}&qrImageUrl=${qrImageUrl}`;

      // Send the query string as a JSON response
      res.json({ userDataQueryString });
    }
  } catch (error) {
    console.error(error);
    console.log("error :");
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
