const { default: mongoose, Types } = require("mongoose");
const Attendance = require("../models/attendance");
const moment = require("moment");
const paidReg = require("../models/paidReg");

// @desc      CREATE NEW ATTENDANCE
// @route     POST /api/v1/attendance
// @access    protect
exports.createAttendance = async (req, res) => {
  try {
    const email = req.body.email;

    // Check if the user is already registered
    let existingUser = await paidReg.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    // Check if the user has already attended
    if (existingUser.attended == true) {
      return res.status(400).json({
        success: false,
        message: "User has already attended",
      });
    }

    // Check if the user is already in Attendance model
    const existingAttendance = await Attendance.findOne({
      user: existingUser._id,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "User already in Attendance",
        user: existingAttendance,
      });
    }

    // Mark attended in paidReg model
    existingUser.attended = true;
    await existingUser.save();

    // Save the user in Attendance collection
    const newAttendance = await Attendance.create({
      user: existingUser._id,
      date: moment().toDate(), // Save current date using moment
      status: true,
    });

    res.status(200).json({
      success: true,
      message: "Attendance Marked successfully",
      data: newAttendance,
      userData: existingUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc      GET ALL ATTENDANCE
// @route     GET /api/v1/attendance
// @access    public
exports.getAttendance = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Attendance.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific attendance",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, day: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalAttendanceCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Attendance.countDocuments(),
      parseInt(skip) === 0 && Attendance.countDocuments(query),
      Attendance.find(query)
        .populate("user")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    const [approved, pending, totalReg] = await Promise.all([
      paidReg.countDocuments({ approved: true }),
      paidReg.countDocuments({ approved: false }),
      paidReg.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all attendance",
      response: data,
      count: data.length,
      approved,
      pending,
      totalReg,
      attendanceCount: data.length,
      totalAttendanceCount: totalAttendanceCount || 0,
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

// @desc      UPDATE SPECIFIC ATTENDANCE
// @route     PUT /api/v1/attendance/:id
// @access    protect
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC ATTENDANCE
// @route     DELETE /api/v1/attendance/:id
// @access    protect
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.query.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ATTENDANCE
// @route     GET /api/v1/attendance/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Attendance.find(
      {},
      { _id: 0, id: "$_id", value: "$day" }
    );
    console.log(items);
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      CREATE NEW ATTENDANCE
// @route     POST /api/v1/attendance/revoke
// @access    protect
exports.revokeAttendance = async (req, res) => {
  try {
    const email = req.body.email;

    // Check if the user is already registered
    let existingUser = await paidReg.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    // Check if the user has already attended
    if (existingUser.attended == false) {
      return res.status(400).json({
        success: false,
        message: "User has already Revoked",
      });
    }

    // Check if the user is already in Attendance model
    const existingAttendance = await Attendance.deleteOne({
      user: existingUser._id,
    });    

    // Mark attended in paidReg model
    existingUser.attended = false;
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Attendance Revoked successfully",
      userData: existingUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};