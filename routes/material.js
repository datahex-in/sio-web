const router = require("express").Router();
// Controllers
const {
    createMaterial,
    getMaterial,
    updateMaterial,
    deleteMaterial,
} = require("../controllers/material");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/speakers", ["materialUpload"]),
        getS3Middleware(["materialUpload"]),
        createMaterial
    )
    .get(reqFilter, getMaterial)
    .put(
        getUploadMiddleware("uploads/speakers", ["materialUpload"]),
        getS3Middleware(["materialUpload"]), updateMaterial
    )
    .delete(deleteMaterial);

module.exports = router;
