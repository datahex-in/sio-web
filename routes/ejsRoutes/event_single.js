var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Faq = require("../../models/Faq");
const Speaker = require("../../models/Speaker");

router.get("/:id", async function (req, res, next) {
  const eventId = req.params.id;
  const eventData = await Events.findById(eventId);
  const speakerData = await Speaker.find({ event: eventId });
  const faqData = await Faq.find({ event: eventId });
  console.log(eventData);
  res.render("event_single", { eventData, speakerData, faqData });
});

module.exports = router;
