const { default: mongoose } = require("mongoose");
const Event = require("../models/event");
const Registration = require("../models/Registration");

let eventId;

exports.getRegEvent = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, event } = req.query;
    if (event && mongoose.isValidObjectId(event)) {
      // Find the event by ID
      const eventData = await Event.findById(event);

      // If the event is found, retrieve registered users for that event
      if (eventData) {
        const response = await Registration.find({ events: event })
          .populate("events") // Populate the 'events' field with Event documents
          .exec();

        return res.status(200).json({
          success: true,
          message: "Retrieved specific event and its registered users",
          event,
          response,
        });
      }
    }

    const query = {
      ...req.filter,
      ...(searchkey && {
        title: { $regex: searchkey, $options: "i" },
      }),
    };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Registration.countDocuments(),
      parseInt(skip) === 0 && Registration.countDocuments(query),
      Registration.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

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

exports.deleteRegEvent = async (req, res) => {
  try {
    const { id } = req.query;

    // Check if the provided event ID and registration ID are valid ObjectId
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID or registration ID",
      });
    }

    // Find the user by ID to ensure it exists
    const user = await Registration.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove the specified event ID from the user's events array
    user.events.pull(eventId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed event from user's events",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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
