const express = require("express");
const router = express.Router();
const AboutUs = require("../../models/aboutUs");
const Event = require("../../models/event");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const eventTypeCounts = await Event.aggregate([
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
    ]);

    eventTypeCounts.forEach((item) => {
      console.log(item._id);
    });

    console.log(eventTypeCounts);
    const aboutData = await AboutUs.findOne();
    const eventData = await Event.find();
    console.log(aboutData);
    console.log(eventData);
    res.render("index", { aboutData, eventData, eventTypeCounts });
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;
