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
    const value = req.body.value;
    const result = value.replace(/"/g, "");

    const objectId = new mongoose.Types.ObjectId(result);

    const selectedEvent = req.body.event;

    // // Find the user in the Registration collection and update the 'attended' field to true
    // const updatedUser = await Registration.findByIdAndUpdate(objectId, {
    //   attended: true,
    // });

    // if (!updatedUser) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // Now, add an entry in the EventAttendance collection
    const eventAttendance = new EventAttendance({
      events: selectedEvent, // Use the event ID
      user: objectId, // Use the user ID
      attended: true,
      attendedDate: new Date(),
    });

    await eventAttendance.save();

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
