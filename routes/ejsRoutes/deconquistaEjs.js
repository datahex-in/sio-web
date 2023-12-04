var express = require("express");
var router = express.Router();
const Speaker = require("../../models/globalSpeaker");
const Deconquista = require("../../models/deconquista");
const LeadersNote = require("../../models/leadersNote");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const speakerData = await Speaker.find();
  const deconquistaData = await Deconquista.find();
  const leadersNoteData = await LeadersNote.find();
  res.render("deconquista", { speakerData, deconquistaData, leadersNoteData });
});

module.exports = router;
