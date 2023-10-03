const router = require("express").Router();
// Controllers
const {
    createLeadersNote,
    getLeadersNote,
    updateLeadersNote,
    deleteLeadersNote,
    // getByFranchise,
} = require("../controllers/leadersNote");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/leadersNote", ["image"]),
        getS3Middleware(["image"]),
        createLeadersNote
    )
    .get(reqFilter, getLeadersNote)
    .put(
        getUploadMiddleware("uploads/leadersNote", ["image"]),
        getS3Middleware(["image"]), updateLeadersNote
    )
    .delete(deleteLeadersNote);

module.exports = router;
