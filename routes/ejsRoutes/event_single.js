var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Faq = require("../../models/Faq");
const Speaker = require("../../models/Speaker");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "365382382373-tahn4pldb3gsa4e483o026jpm80rgqej.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

router.post("/google-signin", async (req, res) => {
  const idToken = req.body.id_token;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract user data from the payload
    const userId = payload.sub;
    const userName = payload.name;
    const userEmail = payload.email;
    const userImage = payload.picture;

    // Store user data in the session
    req.session.userData = {
      userId,
      userName,
      userEmail,
      userImage,
    };

    // You can now use this user data as needed
    console.log("User ID:", userId);
    console.log("User Name:", userName);
    console.log("User Email:", userEmail);
    console.log("User Image URL:", userImage);

    // Send a response back to the client
    res.json({
      success: true,
      message: "User data received successfully",
      userData: req.session.userData, // Send the stored user data back to the client
    });
  } catch (error) {
    console.error("Error verifying Google Sign-In token:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
});


router.get("/:id", async function (req, res, next) {
  const eventId = req.params.id;
  const eventData = await Events.findById(eventId);
  const speakerData = await Speaker.find({ event: eventId });
  const faqData = await Faq.find({ event: eventId });

  // You can also pass the user data to the template
  const userData = req.session.userData; // Assuming you store user data in a session

  res.render("event_single", {
    eventData,
    speakerData,
    faqData,
    userData,
  });
});

module.exports = router;
