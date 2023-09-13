const { default: mongoose } = require("mongoose");
const EventUser = require("../models/eventUser");

// @desc      CREATE NEW EVENT USER
// @route     POST /api/v1/event-user
// @access    protect
exports.createEventUser = async (req, res) => {
    try {
        const newEventUser = await EventUser.create(req.body);
        res.status(200).json({
            success: true,
            message: "Event user created successfully",
            data: newEventUser,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ALL EVENT USER
// @route     GET /api/v1/event-user
// @access    public
exports.getEventUser = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;

        if (id && mongoose.isValidObjectId(id)) {
            const response = await EventUser.findById(id);
            return res.status(200).json({
                success: true,
                message: "Retrieved specific event user",
                response,
            });
        }

        const query = searchkey
            ? { ...req.filter, date: { $regex: searchkey, $options: "i" } }
            : req.filter;

        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && EventUser.countDocuments(),
            parseInt(skip) === 0 && EventUser.countDocuments(query),
            EventUser.find(query).populate("event").populate("registration")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50)
                .sort({ _id: -1 }),
        ]);

        res.status(200).json({
            success: true,
            message: `Retrieved all event user`,
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

// @desc      UPDATE SPECIFIC EVENT USER
// @route     PUT /api/v1/event-user/:id
// @access    protect
exports.updateEventUser = async (req, res) => {
    try {
        const eventUser = await EventUser.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });

        if (!eventUser) {
            return res.status(404).json({
                success: false,
                message: "Event user not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event user updated successfully",
            data: eventUser,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      DELETE SPECIFIC EVENT USER
// @route     DELETE /api/v1/event-user/:id
// @access    protect
exports.deleteEventUser = async (req, res) => {
    try {
        const eventUser = await EventUser.findByIdAndDelete(req.query.id);

        if (!eventUser) {
            return res.status(404).json({
                success: false,
                message: "Event user not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event user deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
