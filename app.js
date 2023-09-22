var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const session = require("express-session");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Registration = require("./models/Registration.js");

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

app.use(
  session({
    secret: "This_is_my_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8072",
  "https://sio-kerala-deconquista-qywe3.ondigitalocean.app",
  "https://lemon-grass-0c88ad110.3.azurestaticapps.net",
  "https://lively-wave-04701e810.3.azurestaticapps.net",
  "https://sio-kerala-admin-6gv6l.ondigitalocean.app",
  "https://accounts.google.com",
  "https://oauth.googleusercontent.com",
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
var scheduleRouter = require("./routes/ejsRoutes/scheduleEjs");
var Faq = require("./routes/ejsRoutes/faqEjs");
var Speaker = require("./routes/ejsRoutes/speakerEjs");
var Programe = require("./routes/ejsRoutes/programeEjs");
var Deconquista = require("./routes/ejsRoutes/deconquistaEjs");
var Calender = require("./routes/ejsRoutes/calenderEjs");
var Register = require("./routes/ejsRoutes/registerEjs");
var eventSingle = require("./routes/ejsRoutes/event_single");
var Updates = require("./routes/ejsRoutes/updatesEjs");

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
const globalFaq = require("./routes/globalFaq.js");
const about = require("./routes/aboutUs.js");
const gallery = require("./routes/gallery");
const news = require("./routes/news");
const speakers = require("./routes/speakers");
const globalSpeakers = require("./routes/globalSpeakers.js");
const material = require("./routes/material");
const registration = require("./routes/registration");
const testimonial = require("./routes/testimonial");
const event = require("./routes/event");
const eventUser = require("./routes/eventUser");
const { errorMonitor } = require("stream");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

app.use("/", indexRouter);
app.use("/event", eventRouter); /*layout names*/
app.use("/contact", contactRouter);
app.use("/event_single", eventSingle);
app.use("/schedule", scheduleRouter);
app.use("/faq", Faq);
app.use("/speaker", Speaker);
app.use("/programe", Programe);
app.use("/deconquista", Deconquista);
app.use("/calender", Calender);
app.use("/register", Register);
app.use("/updates", Updates);

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
app.use("/api/v1/global-faq", globalFaq);
app.use("/api/v1/about-us", about);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/news", news);
app.use("/api/v1/speakers", speakers);
app.use("/api/v1/global-speakers", globalSpeakers);
app.use("/api/v1/material", material);
app.use("/api/v1/registration", registration);
app.use("/api/v1/testimonial", testimonial);
app.use("/api/v1/event", event);
app.use("/api/v1/event-user", eventUser);

// ---------------------------------------------------- Google Auth Start ------------------------------------------------ \\

// Passport.js configuration
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8072/auth/google/callback", // process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get the user's Google ID and email from the profile
        const googleId = profile.id;
        const googleEmail = profile.emails[0].value;
        const googleName = profile.displayName;

        // Check if the user exists in your MongoDB database using googleId or email
        let user = await Registration.findOne({
          $or: [{ googleId }, { email: googleEmail }],
        });

        if (!user) {
          // If the user doesn't exist, redirect them to the registration page with the email query parameter
          return done(null, false, {
            message: "User not registered",
            email: googleEmail,
            name: googleName,
          });
        } else {
          // If the user already exists, update their Google ID if it's not already set
          if (!user.googleId) {
            user.googleId = googleId;
            // Save the updated user in the database
            await user.save();
          }
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Route for Google OAuth authentication
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback route after successful Google OAuth authentication
app.get("/auth/google/callback", async (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    try {
      if (err) return next(err);

      // Handle the case where the user is not registered
      if (!user) {
        const redirectUrl = `/register?email=${info.email}&name=${info.name}`;
        return res.redirect(redirectUrl);
      }

      const eventId = req.cookies.eventId;
      console.log("eventId : ", eventId);

      // Check if the user's database record already has eventId
      const hasEventId = user.events.includes(eventId);

      if (hasEventId) {
        // If eventId is already in the user's events, you can handle it here.
        return res.redirect(`/event_single/${eventId}`);
      } else {
        // If eventId is not found in the user's events, add it
        user.events.push(eventId); // Add eventId to the user's events array
        await user.save(); // Save the updated user record with the new eventId

        req.logIn(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          return res.redirect("/"); // Redirect to the home page or any other desired page
        });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// ---------------------------------------------------- Google Auth End ------------------------------------------------ \\

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
