var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Registration = require("../../models/Registration");
const { default: mongoose } = require("mongoose");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const userData = req.query;
    console.log(userData);

    // Assuming userData.events is either an array of event IDs or a comma-separated string
    let eventIds = [];

    if (userData.events) {
      // Check if userData.events is defined (not undefined or null)
      if (Array.isArray(userData.events)) {
        // If it's already an array, use it as is
        eventIds = userData.events.filter((eventId) =>
          mongoose.Types.ObjectId.isValid(eventId)
        );
      } else {
        // If it's not an array, assume it's a comma-separated string and split it
        eventIds = userData.events
          .split(",")
          .map((eventId) => eventId.trim())
          .filter((eventId) => mongoose.Types.ObjectId.isValid(eventId));
      }
    }

    // Now, eventIds only contains valid ObjectId values

    const eventData = await Events.find({ _id: { $in: eventIds } });

    // Render the profile page with eventData and userData
    res.render("profile", { eventData, userData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/* DELETE event by ID. */
router.delete("/delete/:eventId", async function (req, res, next) {
  try {
    const eventId = req.params.eventId;

    // Remove the event reference from all registrations
    await Registration.updateMany(
      { events: eventId },
      { $pull: { events: eventId } }
    );

    // Redirect back to the profile page without the deleted event ID
    const userData = req.query;
    let updatedEventIds = [];

    if (userData.events) {
      // Check if userData.events is defined
      updatedEventIds = Array.isArray(userData.events)
        ? userData.events.filter((id) => id !== eventId)
        : userData.events.split(",").filter((id) => id !== eventId);
    }

    const queryParameters = new URLSearchParams({
      ...userData,
      events: updatedEventIds.join(","), // Update the events parameter
    }).toString();

    res.redirect(`/profile?${queryParameters}`);
  } catch (error) {
    console.error("Error deleting event from registrations:", error);
    res
      .status(500)
      .json({ message: "Failed to delete event from registrations" });
  }
});

module.exports = router;
