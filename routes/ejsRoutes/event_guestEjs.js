var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Speaker = require("../../models/Speaker");

/* GET home page. */

router.get("/:id", async function (req, res, next) {
  try {
    const eventId = req.params.id;
    const eventData = await Events.findById(eventId);
    const speakerData = await Speaker.find({ event: eventId });

    console.log("Event Data:", eventData);
    console.log("Speaker Data:", speakerData);

    if (!eventData) {
      return res.status(404).send("Event not found");
    }

    res.render("event_guest", { eventData, speakerData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
