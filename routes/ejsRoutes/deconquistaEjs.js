var express = require("express");
var router = express.Router();
const Speaker = require('../../models/globalSpeaker')
/* GET home page. */
router.get("/", async function (req, res, next) {
  const speakerData = await Speaker.find()
  console.log(speakerData)
  res.render("deconquista", { speakerData });
});

module.exports = router;
