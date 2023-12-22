const router = require("express").Router();
// Controllers
const {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  select,
  revokeAttendance
  // getByFranchise,
} = require("../controllers/attendance");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createAttendance)
  .get(reqFilter, getAttendance)
  .put(updateAttendance)
  .delete(deleteAttendance);

router.get("/select", reqFilter, select);
router.post("/revoke", revokeAttendance);

module.exports = router;