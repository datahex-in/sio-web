var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Faq = require("../../models/Faq");

/* GET home page. */

router.get("/:id", async function (req, res, next) {
  try {
    const eventId = req.params.id;
    const eventData = await Events.findById(eventId);
    const faqData = await Faq.find({ event: eventId });

    console.log("Event Data:", eventData);
    console.log("Faq Data:", faqData);

    if (!eventData) {
      return res.status(404).send("Event not found");
    }

    res.render("event_FAQs", { eventData, faqData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
