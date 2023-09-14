var express = require("express");
var router = express.Router();
const Events = require("../../models/event");

/* GET home page. */
router.get("/:id", async function (req, res, next) {
  const eventId = req.params.id;
  const eventData = await Events.findById(eventId);
  console.log(eventData);
  res.render("event_theme", { eventData });
});

module.exports = router;
