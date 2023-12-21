const { default: mongoose } = require("mongoose");
const SpeakerPoster = require("../models/speakerPoster");

// @desc      CREATE NEW NEWS
// @route     POST /api/v1/speakerPoster
// @access    private
exports.createSpeakerPoster = async (req, res) => {
    try {
        const newSpeakerPoster = await SpeakerPoster.create(req.body);
        res.status(200).json({
            success: true,
            message: "SpeakerPoster created successfully",
            data: newSpeakerPoster,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// @desc      GET NEWS
// @route     GET /api/v1/speakerPoster/:id
// @access    private
exports.getSpeakerPoster = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;
        if (id && mongoose.isValidObjectId(id)) {
            const response = await SpeakerPoster.findById(id);
            return res.status(200).json({
                success: true,
                message: `Retrieved specific speakerPoster`,
                response,
            });
        }
        const query = {
            ...req.filter,
            ...(searchkey && {
                $or: [{ title: { $regex: searchkey, $options: "i" } }],
            }),
        };
        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && SpeakerPoster.countDocuments(),
            parseInt(skip) === 0 && SpeakerPoster.countDocuments(query),
            SpeakerPoster.find(query)
                // .populate("franchise")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all speakerPoster`,
            response: data,
            count: data.length,
            totalCount: totalCount || 0,
            filterCount: filterCount || 0,
        });
    } catch (err) {
        console.log(err);
        res.status(204).json({
            success: false,
            message: err.toString(),
        });
    }
};

// @desc      UPDATE SPECIFIC NEWS
// @route     PUT /api/v1/speakerPoster/:id
// @access    private
exports.updateSpeakerPoster = async (req, res) => {
    try {
        const response = await SpeakerPoster.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated specific speakerPoster",
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

// @desc      DELETE SPECIFIC NEWS
// @route     DELETE /api/v1/speakerPoster/:id
// @access    private
exports.deleteSpeakerPoster = async (req, res) => {
    try {
        const speakerPoster = await SpeakerPoster.findByIdAndDelete(req.query.id);

        if (!speakerPoster) {
            return res.status(404).json({
                success: false,
                message: "SpeakerPoster not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "SpeakerPoster deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
