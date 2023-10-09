const router = require("express").Router();
// Controllers
const { getRegEvent,deleteRegEvent, select } = require("../controllers/eventRegUser");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .get(reqFilter, getRegEvent)
  .delete(deleteRegEvent);
router.get("/select", reqFilter, select);

module.exports = router;
