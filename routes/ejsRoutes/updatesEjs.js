const express = require("express");
const router = express.Router();
const News = require("../../models/news");
const Article = require("../../models/article");
const Testimonial = require("../../models/testimonial");
const Gallery = require('../../models/gallery')

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const newsData = await News.find();
    const articleData = await Article.find();
    const testimonialData = await Testimonial.find();
    const galleryData = await Gallery.find();
    console.log(newsData);
    console.log(testimonialData);
    console.log(galleryData);
    res.render("updates", { newsData, testimonialData, galleryData, articleData });
  } catch (error) {
    console.log(error)
    console.error(error);
  }
});

module.exports = router;
