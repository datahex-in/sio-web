const { default: mongoose } = require("mongoose");
const Event = require("../models/event");
const Registration = require("../models/Registration");
const EventAttendance = require("../models/eventAttendance");

// @desc      CREATE NEW EVENT
// @route     POST /api/v1/event
// @access    protect
exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(200).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { event, qrCodeData } = req.query;

    console.log("Id :- ", event);
    console.log("user qr Id :- ", qrCodeData);
    if (event && mongoose.isValidObjectId(event)) {
      // Find the event by ID
      const eventData = await Event.findById(event);

      console.log("event Data -- ", eventData);
      // If the event is found, retrieve registered users for that event
      if (eventData) {
        // Find or create an EventAttendance document for the user
        const eventAttendance = await EventAttendance.findOneAndUpdate(
          { user: qrCodeData, events: event },
          { $set: { attended: true, attendedDate: new Date() } },
          { upsert: true, new: true }
        );

        console.log("Updated event attendance:", eventAttendance);

        const response = eventAttendance
        if (eventAttendance) {
          return res.status(200).json({
            success: true,
            message: "Updated event attendance",
            event,
            
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "User is not registered for this event",
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC EVENT
// @route     PUT /api/v1/event/:id
// @access    protect
exports.updateEvent = async (req, res) => {
  try {
    const events = await Event.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!events) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: events,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC EVENT
// @route     DELETE /api/v1/event/:id
// @access    protect
exports.deleteEvent = async (req, res) => {
  try {
    const events = await Event.findByIdAndDelete(req.query.id);

    if (!events) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET EVENT'S
// @route     GET /api/event/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Event.find({}, { _id: 0, id: "$_id", value: "$title" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};
