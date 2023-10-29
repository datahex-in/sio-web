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
    const valueObject = result;
    console.log(valueObject);
    console.log(valueObject.userId);

    const objectId = new mongoose.Types.ObjectId(valueObject.userId);
    console.log(objectId);

    const selectedEvent = req.body.event;
    const eventData = await Event.findById(selectedEvent);
    console.log(eventData);

    if (eventData) {
      const registration = await Registration.findOne({
        _id: objectId,
        events: selectedEvent,
      }).exec();

      if (registration) {
        // User has the specific event
        console.log("User has this event");
        console.log(registration);

        // Check if an entry with the same user and event combination already exists
        const existingEntry = await EventAttendance.findOne({
          user: objectId,
          events: selectedEvent,
        });

        if (existingEntry) {
          return res.status(400).json({ message: "Entry already exists" });
        }

        const eventAttendance = new EventAttendance({
          events: selectedEvent,
          user: objectId,
          attended: true,
          attendedDate: new Date(),
        });

        await eventAttendance.save();

        res.status(200).json({ message: "Entry added successfully" });
      } else {
        // User does not have the specific event, so do not create EventAttendance entry
        console.log("User does not have this event");
        return res
          .status(400)
          .json({ message: "User does not have this event" });
      }
    } else {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
