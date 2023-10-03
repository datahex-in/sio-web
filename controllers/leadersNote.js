const { default: mongoose } = require("mongoose");
const LeadersNote = require("../models/leadersNote");

// @desc      CREATE NEW LeadersNote
// @route     POST /api/v1/LeadersNote
// @access    private
exports.createLeadersNote = async (req, res) => {
    try {
        const newLeadersNote = await LeadersNote.create(req.body);
        res.status(200).json({
            success: true,
            message: "LeadersNote created successfully",
            data: newLeadersNote,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// @desc      GET LeadersNote
// @route     GET /api/v1/LeadersNote/:id
// @access    private
exports.getLeadersNote = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;
        if (id && mongoose.isValidObjectId(id)) {
            const response = await LeadersNote.findById(id);
            return res.status(200).json({
                success: true,
                message: `Retrieved specific LeadersNote`,
                response,
            });
        }
        const query = {
            ...req.filter,
            ...(searchkey && {
                $or: [{ title: { $regex: searchkey, $options: "i" } },
                { content: { $regex: searchkey, $options: "i" } }],
            }),
        };
        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && LeadersNote.countDocuments(),
            parseInt(skip) === 0 && LeadersNote.countDocuments(query),
            LeadersNote.find(query)
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all LeadersNote`,
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

// @desc      UPDATE SPECIFIC LeadersNote
// @route     PUT /api/v1/LeadersNote/:id
// @access    private
exports.updateLeadersNote = async (req, res) => {
    try {
        const response = await LeadersNote.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated specific LeadersNote",
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

// @desc      DELETE SPECIFIC LeadersNote
// @route     DELETE /api/v1/LeadersNote/:id
// @access    private
exports.deleteLeadersNote = async (req, res) => {
    try {
        const leadersNote = await LeadersNote.findByIdAndDelete(req.query.id);

        if (!leadersNote) {
            return res.status(404).json({
                success: false,
                message: "LeadersNote not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "LeadersNote deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
