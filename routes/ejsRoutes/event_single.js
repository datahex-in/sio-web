var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Faq = require("../../models/Faq");
const Speaker = require("../../models/Speaker");

/* GET home page. */

// router.get("/event_about/:id", async function (req, res, next) {
//   const eventId = req.params.id;
//   const eventData = await Events.findById( eventId );
//   console.log(eventData);
//   res.render("event_about", { eventData });
// });

// router.get("/event_FAQs/:id", async function (req, res, next) {
//     try {
//       const eventId = req.params.id;
//       const eventData = await Events.findById(eventId);
//       const faqData = await Faq.find({ event: eventId });
  
//       console.log("Event Data:", eventData);
//       console.log("Faq Data:", faqData);
  
//       if (!eventData) {
//         return res.status(404).send("Event not found");
//       }
  
//       res.render("event_FAQs", { eventData, faqData });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });

//   router.get("/event_guest/:id", async function (req, res, next) {
//     try {
//       const eventId = req.params.id;
//       const eventData = await Events.findById(eventId);
//       const speakerData = await Speaker.find({ event: eventId });
  
//       console.log("Event Data:", eventData);
//       console.log("Speaker Data:", speakerData);
  
//       if (!eventData) {
//         return res.status(404).send("Event not found");
//       }
  
//       res.render("event_guest", { eventData, speakerData });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });

//   router.get("/event_theme/:id", async function (req, res, next) {
//     const eventId = req.params.id;
//     const eventData = await Events.findById(eventId);
//     console.log(eventData);
//     res.render("event_theme", { eventData });
//   });

  router.get("/:id", async function (req, res, next) {
    const eventId = req.params.id;
    const eventData = await Events.findById(eventId);
    const speakerData = await Speaker.find({ event: eventId });
    const faqData = await Faq.find({ event: eventId });
    console.log(eventData);
    res.render("event_single", { eventData, speakerData, faqData });
  });

//   router.get("/:id", async function (req, res, next) {
//     try {
//       const eventId = req.params.id;
//       const eventData = await Events.findById(eventId);
//       const speakerData = await Speaker.find({ event: eventId });
//       const faqData = await Faq.find({ event: eventId });
  
//       // Send the data as JSON response
//       res.json({ eventData, speakerData, faqData });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
  

module.exports = router;
