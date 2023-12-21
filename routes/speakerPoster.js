const router = require("express").Router();
// Controllers
const {
  createSpeakerPoster,
  getSpeakerPoster,
  updateSpeakerPoster,
  deleteSpeakerPoster,
  // getByFranchise,
} = require("../controllers/speakerPoster");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/speakerPoster", ["image"]),
    getS3Middleware(["image"]),
    createSpeakerPoster
  )
  .get(reqFilter, getSpeakerPoster)
  .put(
    getUploadMiddleware("uploads/speakerPoster", ["image"]),
    getS3Middleware(["image"]),
    updateSpeakerPoster
  )
  .delete(deleteSpeakerPoster);

module.exports = router;
