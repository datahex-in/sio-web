var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Registration = require("../../models/Registration");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const userData = req.query;
    console.log(userData);

    // Assuming userData.events is either an array of event IDs or a comma-separated string
    let eventIds = Array.isArray(userData.events)
      ? userData.events
      : userData.events.split(",");

    // Filter out empty strings and invalid values from eventIds
    eventIds = eventIds.filter((eventId) => eventId.trim() !== "");

    if (eventIds.length === 0) {
      // No valid event IDs found, you may want to handle this case
      return res.status(400).send("No valid event IDs provided");
    }

    // Find events using the filtered event IDs
    const eventData = await Events.find({ _id: { $in: eventIds } });

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
