const router = require("express").Router();
// Controllers
const {
    createEventUser,
    getEventUser,
    updateEventUser,
    deleteEventUser,
} = require("../controllers/eventUser");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
    .route("/")
    .post(createEventUser)
    .get(reqFilter, getEventUser)
    .put(updateEventUser)
    .delete(deleteEventUser);

module.exports = router;
