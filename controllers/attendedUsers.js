const { default: mongoose } = require("mongoose");
const Event = require("../models/event");
const EventAttendance = require("../models/eventAttendance");
const Registration = require("../models/Registration");

// @desc      CREATE NEW EVENT
// @route     POST /api/v1/event
// @access    protect
exports.createEvent = async (req, res) => {
  try {
    const newEvent = await EventAttendance.create(req.body);
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

// @desc      GET ALL EVENT
// @route     GET /api/v1/event
// @access    public
exports.getEvent = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, event } = req.query;

    console.log(searchkey);
    if (event && mongoose.isValidObjectId(event)) {
      const eventDetail = await Event.findById(event);
      console.log("response../", eventDetail);

      // Find users in EventAttendance collection with the specified event ID
      const users = await EventAttendance.find({
        events: new mongoose.Types.ObjectId(event),
      }).populate("user");

      const response = users.map((userAttendance) => userAttendance.user);

      console.log("user..", users);
      console.log("User Response..", response);

      return res.status(200).json({
        success: true,
        message: "Retrieved specific event",
        response,
      });
    }

    const query = {
      ...req.filter,
      ...(searchkey && {
        title: { $regex: searchkey, $options: "i" },
      }),
    };

    let [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Event.countDocuments(),
      parseInt(skip) === 0 && Event.countDocuments(query),
      Event.find(query)
        .populate("user") // Populate the "user" field
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    console.log("data", data);

    res.status(200).json({
      success: true,
      message: `Retrieved all event`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
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
