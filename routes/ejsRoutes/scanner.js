const express = require("express");
const Registration = require("../../models/Registration");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const Event = require("../../models/event");
const EventAttendance = require("../../models/eventAttendance");

router.get("/", async (req, res) => {
  const events = await Event.find();
  console.log(events);
  res.render("scan", { events });
});

router.post("/validateqr", async (req, res) => {
  try {
    const result = req.body.value;

    // No need to parse the object, it's already an object
    const valueObject = result;
    console.log(valueObject);
    console.log(valueObject.userId);

    const objectId = new mongoose.Types.ObjectId(valueObject.userId);
    console.log(objectId);

    const selectedEvent = req.body.event;

    // Check if an entry with the same user and event combination already exists
    const existingEntry = await EventAttendance.findOne({
      user: objectId,
      events: selectedEvent,
    });

    if (existingEntry) {
      // An entry with the same user and event already exists, do not add a new entry
      return res.status(400).json({ message: "Entry already exists" });
    }

    const eventAttendance = new EventAttendance({
      events: selectedEvent, // Use the event ID
      user: objectId, // Use the user ID
      attended: true,
      attendedDate: new Date(),
    });

    await eventAttendance.save();

    res.json({ message: "Entry added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
