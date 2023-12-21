var express = require("express");
var router = express.Router();
const SpeakerPoster = require("../../models/speakerPoster");
const Deconquista = require("../../models/deconquista");
const LeadersNote = require("../../models/leadersNote");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const speakerData = await SpeakerPoster.find();
  const deconquistaData = await Deconquista.find();
  const leadersNoteData = await LeadersNote.find();
  res.render("iac", { speakerData, deconquistaData, leadersNoteData });
});

module.exports = router;
