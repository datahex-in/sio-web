const { default: mongoose } = require("mongoose");
const Deconquista = require("../models/deconquista");


// @desc      CREATE Deconquista
// @route     POST /api/v1/about-us
// @access    private
exports.createDeconquista = async (req, res) => {
  try {
    const response = await Deconquista.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully added Deconquista",
      response,
    });
    console.log(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET Deconquista
// @route     GET /api/v1/about-us
// @access    private
exports.getDeconquista = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Deconquista.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific Deconquista`,
        response,
      });
    }
    // const query = searchkey
    //   ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
    //   : req.filter;
    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { vision: { $regex: searchkey, $options: "i" } },
          { mission: { $regex: searchkey, $options: "i" } },
        ],
      }),
    };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Deconquista.countDocuments(),
      parseInt(skip) === 0 && Deconquista.countDocuments(query),
      Deconquista.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all Deconquista`,
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

// @desc      UPDATE Deconquista
// @route     PUT /api/v1/about-us
// @access    private
exports.updateDeconquista = async (req, res) => {
  try {
    const response = await Deconquista.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific Deconquista",
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

// @desc      DELETE Deconquista
// @route     DELETE /api/v1/about-us
// @access    private
exports.deleteDeconquista = async (req, res) => {
  try {
    const deconquista = await Deconquista.findByIdAndDelete(req.query.id);

    if (!deconquista) {
      return res.status(404).json({
        success: false,
        message: "Deconquista not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deconquista deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
