var express = require("express");
var router = express.Router();
const Events = require('../../models/event')

/* GET home page. */
router.get("/", async function (req, res, next) {
  const eventData = await Events.find();
  console.log(eventData);
  res.render("event",{eventData});
});


module.exports = router;
