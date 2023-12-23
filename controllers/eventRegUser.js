const { default: mongoose } = require("mongoose");
const Event = require("../models/event");
const Registration = require("../models/Registration");
const paidReg = require("../models/paidReg");

let eventId;

exports.getRegEvent = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, event } = req.query;
    console.log(req.query);
    eventId = event;

    const query = {
      ...req.filter,
      ...(searchkey && {
        title: { $regex: searchkey, $options: "i" },
      }),
      
    };
    if (event && mongoose.isValidObjectId(event)) {
      // Find the event by ID
      const eventData = await Event.findById(event);

      // If the event is found, retrieve registered users for that event
      if (eventData) {
        // Find registered users for the specific event and populate the 'events' field
        const response = await paidReg.find({ events: event })
          .populate("events")
          .exec();
      
        // Get the total count of registered users for the specific event
        const totalCount = await paidReg.countDocuments({ events: event });
      
        // Return the response with the list of users and the total count
        return res.status(200).json({
          success: true,
          message: "Retrieved specific event and its registered users",
          event,
          count: response.length,
          filterCount: response.length,
          totalCount: totalCount || 0,
          response,
        });
      }
    }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && paidReg.countDocuments(),
      parseInt(skip) === 0 && paidReg.countDocuments(query),
      paidReg.find(query)
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
  console.log(req.query);
  try {
    const { id, event } = req.query;
    console.log(event);
    const objectId = new mongoose.Types.ObjectId(id);
    console.log(objectId);

    // Check if the provided event ID is a valid ObjectId
    if (!mongoose.isValidObjectId(objectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    // Find the user by ID to ensure it exists
    const user = await Registration.findOne({ _id: objectId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove the specified event ID from the user's events array
    console.log(user.events);
    user.events.pull(eventId);
    await user.save();
    console.log(user);

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
