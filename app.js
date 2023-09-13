var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://lemon-grass-0c88ad110.3.azurestaticapps.net",
  "https://lively-wave-04701e810.3.azurestaticapps.net",
];

//cors policy
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Connect to database
connectDB();

app.use("/images", express.static("./public/user"));
app.use("/images", express.static("./public/proteincategory"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

var indexRouter = require("./routes/ejsRoutes/indexEjs"); /*page from route*/
var contactRouter = require("./routes/ejsRoutes/contactEjs");
var eventRouter = require("./routes/ejsRoutes/eventEjs");
var eventAboutRouter = require("./routes/ejsRoutes/event_aboutEjs");
var eventThemeRouter = require("./routes/ejsRoutes/event_themeEjs");
var eventGuestRouter = require("./routes/ejsRoutes/event_guestEjs");
var eventFAQsRouter = require("./routes/ejsRoutes/event_FAQsEjs");
var event_listRouter = require("./routes/ejsRoutes/event-listEjs");
var event_singleRouter = require("./routes/ejsRoutes/event-singleEjs");
var scheduleRouter = require("./routes/ejsRoutes/scheduleEjs");
var Gallery = require("./routes/ejsRoutes/galleryEjs");
var Faq = require("./routes/ejsRoutes/faqEjs");
var Speaker = require("./routes/ejsRoutes/speakerEjs");
var Programe = require("./routes/ejsRoutes/programeEjs");
var News = require("./routes/ejsRoutes/newsEjs");
var Deconquista = require("./routes/ejsRoutes/deconquistaEjs");
var Calender = require("./routes/ejsRoutes/calenderEjs");

// ADDED NEWS ROUTES-------
var Privacy = require("./routes/ejsRoutes/privacyEjs");
var Refund = require("./routes/ejsRoutes/refundEjs");
var Conditions = require("./routes/ejsRoutes/conditionsEjs");

// route files
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const userType = require("./routes/userType.js");
const menu = require("./routes/menu.js");
const subMenu = require("./routes/subMenu.js");
const menuRole = require("./routes/menuRole.js");
const subMenuRole = require("./routes/subMenuRole.js");
const appointment = require("./routes/appointment.js");
const franchise = require("./routes/franchise.js");
const dashboard = require("./routes/dashboard.js");
const faq = require("./routes/faq.js");
// const gallery = require("./routes/gallery");
const news = require("./routes/news");
const speakers = require("./routes/speakers");
const material = require("./routes/material");
const registration = require("./routes/registration");
const testimonial = require("./routes/testimonial");
const event = require("./routes/event");
const eventUser = require("./routes/eventUser");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

app.use("/", indexRouter);
app.use("/event", eventRouter); /*layout names*/
app.use("/event_about", eventAboutRouter);
app.use("/event_theme", eventThemeRouter);
app.use("/event_guest", eventGuestRouter);
app.use("/event_FAQs", eventFAQsRouter);
app.use("/contact", contactRouter);
app.use("/event-list", event_listRouter);
app.use("/event-single", event_singleRouter);
app.use("/schedule", scheduleRouter);
app.use("/gallery", Gallery);
app.use("/faq", Faq);
app.use("/speaker", Speaker);
app.use("/programe", Programe);
app.use("/news", News);
app.use("/deconquista", Deconquista);
app.use("/calender", Calender);

// LATESTS-----
app.use("/privacy", Privacy);
app.use("/refund", Refund);
app.use("/terms-conditions", Conditions);

// mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/user-type", userType);
app.use("/api/v1/menu", menu);
app.use("/api/v1/sub-menu", subMenu);
app.use("/api/v1/menu-role", menuRole);
app.use("/api/v1/submenu-role", subMenuRole);
app.use("/api/v1/appointment", appointment);
app.use("/api/v1/franchise", franchise);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/faq", faq);
// app.use("/api/v1/gallery", gallery);
app.use("/api/v1/news", news);
app.use("/api/v1/speakers", speakers);
app.use("/api/v1/material", material);
app.use("/api/v1/registration", registration);
app.use("/api/v1/testimonial", testimonial);
app.use("/api/v1/event", event);
app.use("/api/v1/event-user", eventUser);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
