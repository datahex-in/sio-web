const router = require("express").Router();
// Controllers
const {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  select,
} = require("../controllers/event");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/event", ["image", "headerImage"]),
    getS3Middleware(["image", "headerImage"]),
    createEvent
  )
  .get(reqFilter, getEvent)
  .put(
    getUploadMiddleware("uploads/event", ["image", "headerImage"]),
    getS3Middleware(["image", "headerImage"]),
    updateEvent
  )
  .delete(deleteEvent);

router.get("/select", reqFilter, select);

module.exports = router;
