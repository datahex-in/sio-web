    const { default: mongoose } = require("mongoose");
const PaidRegistration = require("../models/paidReg");

// @desc      CREATE NEW REGISTRATION
// @route     POST /api/v1/registration
// @access    private
exports.createRegistration = async (req, res) => {
  try {
    const newRegistration = await PaidRegistration.create(req.body);
    res.status(200).json({
      success: true,
      message: "PaidRegistration created successfully",
      data: newRegistration,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      GET REGISTRATION
// @route     GET /api/v1/registration/:id
// @access    private
exports.getRegistration = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await PaidRegistration.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific registration`,
        response,
      });
    }
    const query = {
      ...req.filter,
      ...(searchkey && {
        name: { $regex: searchkey, $options: "i" },
      }),
    };
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && PaidRegistration.countDocuments(),
      parseInt(skip) === 0 && PaidRegistration.countDocuments(query),
      PaidRegistration.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all registration`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
    console.log("Ressss", data)
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC REGISTRATION
// @route     PUT /api/v1/registration/:id
// @access    private
exports.updateRegistration = async (req, res) => {
  try {
    const response = await PaidRegistration.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Updated specific registration",
      enrollment: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE SPECIFIC REGISTRATION
// @route     DELETE /api/v1/registration/:id
// @access    private
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await PaidRegistration.findByIdAndDelete(req.query.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "PaidRegistration not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "PaidRegistration deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET REGISTRATION'S
// @route     GET /api/registration/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await PaidRegistration.find(
      {},
      { _id: 0, id: "$_id", value: "$name" }
    );
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};
