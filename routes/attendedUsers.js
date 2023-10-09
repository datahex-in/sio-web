const router = require("express").Router();
// Controllers
const {
  createAttendedUser,
  getAttendedUser,
  updateAttendedUser,
  deleteAttendedUser,
  select,
} = require("../controllers/attendedUsers");
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
    createAttendedUser
  )
  .get(reqFilter, getAttendedUser)
  .put(
    getUploadMiddleware("uploads/event", ["image", "headerImage"]),
    getS3Middleware(["image", "headerImage"]),
    updateAttendedUser
  )
  .delete(deleteAttendedUser);

router.get("/select", reqFilter, select);

module.exports = router;
