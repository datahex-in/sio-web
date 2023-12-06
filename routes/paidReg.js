const router = require("express").Router();
// Controllers
const {
    createRegistration,
    getRegistration,
    updateRegistration,
    deleteRegistration,
} = require("../controllers/paidReg");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/registration", ["qrImageUrl"]),
        getS3Middleware(["qrImageUrl"]),
        createRegistration
    )
    .get(reqFilter, getRegistration)
    .put(
        getUploadMiddleware("uploads/registration", ["qrImageUrl"]),
        getS3Middleware(["qrImageUrl"]), updateRegistration
    )
    .delete(deleteRegistration);

module.exports = router;
