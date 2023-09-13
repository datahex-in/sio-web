const express = require("express");
// const Speakers = require("../../models/Speaker");
// const News = require("../../models/news");
// const Testimonial = require("../../models/testimonial");
const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const title = "Welcome to My Website";

    // const speakerData = await Speakers.find();

    // const newsData = await News.find();

    // const testimonialData = await Testimonial.find();
    // console.log(testimonialData);
    res.render("index", {
      title,
      // speakerData,
      // newsData,
      // testimonialData,
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;
