const { default: mongoose } = require("mongoose");
const Event = require("../models/event");
const Registration = require("../models/Registration");

exports.getRegEvent = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, event } = req.query;

    console.log("Id :- ", event);
    if (event && mongoose.isValidObjectId(event)) {
      // Find the event by ID
      const eventData = await Event.findById(event);

      console.log("event Data -- ", eventData);
      // If the event is found, retrieve registered users for that event
      if (eventData) {
        const response = await Registration.find({ events: event })
          .populate("events") // Populate the 'events' field with Event documents
          .exec();

        console.log("registeredUsers :", response);
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
