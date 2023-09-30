const router = require("express").Router();
// Controllers
const {
    createDeconquista,
    getDeconquista,
    updateDeconquista,
    deleteDeconquista,
    // getByFranchise,
} = require("../controllers/deconquista");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/news", ["image"]),
        getS3Middleware(["image"]),
        createDeconquista
    )
    .get(reqFilter, getDeconquista)
    .put(
        getUploadMiddleware("uploads/news", ["image"]),
        getS3Middleware(["image"]), updateDeconquista
    )
    .delete(deleteDeconquista);

module.exports = router;
