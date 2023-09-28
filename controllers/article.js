const { default: mongoose } = require("mongoose");
const Article = require("../models/article");

// @desc      CREATE NEW Article
// @route     POST /api/v1/article
// @access    private
exports.createArticle = async (req, res) => {
    try {
        const newArticle = await Article.create(req.body);
        res.status(200).json({
            success: true,
            message: "Article created successfully",
            data: newArticle,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// @desc      GET Article
// @route     GET /api/v1/article/:id
// @access    private
exports.getArticle = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;
        if (id && mongoose.isValidObjectId(id)) {
            const response = await Article.findById(id);
            return res.status(200).json({
                success: true,
                message: `Retrieved specific article`,
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
            parseInt(skip) === 0 && Article.countDocuments(),
            parseInt(skip) === 0 && Article.countDocuments(query),
            Article.find(query)
                // .populate("franchise")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all article`,
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

// @desc      UPDATE SPECIFIC Article
// @route     PUT /api/v1/Article/:id
// @access    private
exports.updateArticle = async (req, res) => {
    try {
        const response = await Article.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated specific article",
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

// @desc      DELETE SPECIFIC Article
// @route     DELETE /api/v1/article/:id
// @access    private
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.query.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Article deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
