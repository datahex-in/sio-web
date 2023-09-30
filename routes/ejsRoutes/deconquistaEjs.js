var express = require("express");
var router = express.Router();
const Speaker = require("../../models/globalSpeaker");
const Deconquista = require("../../models/deconquista");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const speakerData = await Speaker.find();
  const deconquistaData = await Deconquista.find();
  console.log(speakerData);
  res.render("deconquista", { speakerData, deconquistaData });
});

module.exports = router;
