const router = require("express").Router();
// Controllers
const {
    getDeclined,
} = require("../controllers/decline");
// Middleware
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .get(reqFilter, getDeclined)
module.exports = router;
