const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const session = require("express-session");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Registration = require("./models/Registration.js");
const PaidReg = require("./models/paidReg.js");

const fs = require("fs");
const qr = require("qrcode");

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
  "http://localhost:3002",
  "http://localhost:8072",
  "https://sio-kerala-deconquista-qywe3.ondigitalocean.app",
  "https://lemon-grass-0c88ad110.3.azurestaticapps.net",
  "https://lively-wave-04701e810.3.azurestaticapps.net",
  "https://sio-kerala-admin-6gv6l.ondigitalocean.app",
  "https://accounts.google.com",
  "https://oauth.googleusercontent.com",
  "https://deconquista.siokerala.org",
  "https://event-manager.syd1.cdn.digitaloceanspaces.com",
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
var Paidreg = require("./routes/ejsRoutes/paidregEjs.js");
var PaidRegNext = require("./routes/ejsRoutes/paidRegNext.js");
var eventSingle = require("./routes/ejsRoutes/event_single");
var Updates = require("./routes/ejsRoutes/updatesEjs");
var Profile = require("./routes/ejsRoutes/profileEjs");
var Quotes = require("./routes/ejsRoutes/quotesEjs.js");

const Scanner = require("./routes/ejsRoutes/scanner.js");

// ADDED NEWS ROUTES-------
var Privacy = require("./routes/ejsRoutes/privacyEjs");
var Refund = require("./routes/ejsRoutes/refundEjs");
var Conditions = require("./routes/ejsRoutes/conditionsEjs");

// route files
const scanning = require("./routes/scanner.js");
const attendedUsers = require("./routes/attendedUsers.js");
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
const deconquista = require("./routes/deconquista.js");
const gallery = require("./routes/gallery");
const news = require("./routes/news");
const article = require("./routes/article.js");
const speakers = require("./routes/speakers");
const globalSpeakers = require("./routes/globalSpeakers.js");
const material = require("./routes/material");
const eventRegUser = require("./routes/eventRegUser.js");
const registration = require("./routes/registration");
const paidReg = require("./routes/paidReg.js");
const testimonial = require("./routes/testimonial");
const event = require("./routes/event");
const eventUser = require("./routes/eventUser");
const leadersNote = require("./routes/leadersNote.js");
const approved = require("./routes/approval.js");
const decline = require("./routes/decline.js");
const { errorMonitor } = require("stream");
const { getS3Middleware } = require("./middleware/s3client.js");
const Event = require("./models/event.js");

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
app.use("/registration", Paidreg);
app.use("/updates", Updates);
app.use("/profile", Profile);
app.use("/quotes", Quotes);
app.use("/scan", Scanner);
// app.use("/nextpage",PaidRegNext)
// app.use("/register", Register);
// Redirect /paidreg to /registration
app.use("/nextpage", (req, res) => {
  res.redirect("/registration");
});
app.use("/register", (req, res) => {
  res.redirect("/registration");
});
app.use("/paidreg", (req, res) => {
  res.redirect("/registration");
});
// LATESTS-----
app.use("/privacy", Privacy);
app.use("/refund", Refund);
app.use("/terms-conditions", Conditions);

// mount routers
app.use("/api/v1/scanning", scanning);
app.use("/api/v1/attended-users", attendedUsers);
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
app.use("/api/v1/deconquista", deconquista);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/news", news);
app.use("/api/v1/article", article);
app.use("/api/v1/speakers", speakers);
app.use("/api/v1/global-speakers", globalSpeakers);
app.use("/api/v1/material", material);
app.use("/api/v1/eventRegUser", eventRegUser);
app.use("/api/v1/registration", registration);
app.use("/api/v1/testimonial", testimonial);
app.use("/api/v1/event", event);
app.use("/api/v1/event-user", eventUser);
app.use("/api/v1/leaders-note", leadersNote);
app.use("/api/v1/approved", approved);
app.use("/api/v1/declined", decline);
app.use("/api/v1/paid-reg", paidReg);

// ---------------------------- Site Map -------------------------------- //
app.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");
  res.sendFile(__dirname + "/sitemap.xml");
});
// ---------------------------- ------- -------------------------------- //

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
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get the user's Google ID and email from the profile
        const googleId = profile.id;
        const googleEmail = profile.emails[0].value;
        const googleName = profile.displayName;
        const googlePhoto = profile.photos[0].value;
        console.log(googlePhoto);

        // Check if the user exists in your MongoDB database using googleId or email
        let user = await PaidReg.findOne({
          $or: [{ googleId }, { email: googleEmail }],
        });

        if (!user) {
          // If the user doesn't exist, redirect them to the registration page with the email query parameter
          return done(null, false, {
            message: "User not registered",
            email: googleEmail,
            name: googleName,
            photo: googlePhoto,
          });
        } else if (!user.approved) {
          // If the user is not approved, redirect or handle as needed
          return done(null, false, {
            message: "User not approved",
            email: googleEmail,
            name: googleName,
            photo: googlePhoto,
          });
        } else {
          // If the user already exists and is approved, update their Google ID if it's not already set
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

      if (hasEventId || eventId === null) {
        // If eventId is already in the user's events or is null, redirect to /profile with user data
        const userData = {
          name: user.name, // Replace with actual user data fields
          email: user.email,
          mobileNumber: user.mobileNumber,
          age: user.age,
          gender: user.gender,
          profession: user.profession,
          district: user.district,
          events: user.events,
          user,
          // Add more user data as needed
        };

        // Generate QR code data
        const qrData = {
          userId: user._id,
          email: user.email,
          name: user.name,
          mobileNumber: user.mobileNumber,
          age: user.age,
          gender: user.gender,
          profession: user.profession,
          district: user.district,
          events: user.events,
        };

        // Create the 'qrcodes' directory if it doesn't exist
        const qrCodeDirectory = "./uploads/qrcodes";
        if (!fs.existsSync(qrCodeDirectory)) {
          fs.mkdirSync(qrCodeDirectory);
        }

        // Generate the QR code and save it locally
        const qrCodeFileName = `${qrCodeDirectory}/${user._id}.png`;
        await qr.toFile(qrCodeFileName, JSON.stringify(qrData));

        // Use the S3 middleware to upload the QR image to S3
        const uploadQRImageToS3 = getS3Middleware(["qrImageUrl"]);
        req.body.qrImageUrl = `uploads/qrcodes/${user._id}.png`; // Set the QR image file path in the request body
        // uploadQRImageToS3(req, res); // Upload the QR image to S3

        // Use async/await to ensure the S3 upload completes before proceeding
        await new Promise((resolve, reject) => {
          uploadQRImageToS3(req, res, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        // Update the user's QR image URL with the S3 URL
        userData.qrImageUrl = req.body.qrImageUrl;

        // Append qrImageUrl to the query parameters
        const queryParameters = new URLSearchParams({
          ...userData, // Include all existing user data
          qrImageUrl: userData.qrImageUrl, // Append qrImageUrl
        }).toString();

        return res.redirect(`/profile?${queryParameters}`);
      } else {
        // If eventId is not found in the user's events, add it
        user.events.push(eventId); // Add eventId to the user's events array
        await user.save(); // Save the updated user record with the new eventId

        // Update the corresponding Event document with the user's registration
        await Event.findByIdAndUpdate(
          eventId,
          { $push: { users: user._id } },
          { new: true }
        );

        // Generate QR code data
        const userData = {
          userId: user._id,
          email: user.email,
          name: user.name,
          mobileNumber: user.mobileNumber,
          age: user.age,
          gender: user.gender,
          profession: user.profession,
          district: user.district,
          events: user.events,
        };

        // Create the 'qrcodes' directory if it doesn't exist
        const qrCodeDirectory = "./uploads/qrcodes";
        if (!fs.existsSync(qrCodeDirectory)) {
          fs.mkdirSync(qrCodeDirectory);
        }

        // Generate the QR code and save it locally
        const qrCodeFileName = `${qrCodeDirectory}/${user._id}.png`;
        await qr.toFile(qrCodeFileName, JSON.stringify(userData));

        // Use the S3 middleware to upload the QR image to S3
        const uploadQRImageToS3 = getS3Middleware(["qrImageUrl"]);
        req.body.qrImageUrl = `uploads/qrcodes/${user._id}.png`; // Set the QR image file path in the request body
        // uploadQRImageToS3(req, res); // Upload the QR image to S3

        // Use async/await to ensure the S3 upload completes before proceeding
        await new Promise((resolve, reject) => {
          uploadQRImageToS3(req, res, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        // Update the user's QR image URL with the S3 URL
        userData.qrImageUrl = req.body.qrImageUrl;

        // Append qrImageUrl to the query parameters
        const queryParameters = new URLSearchParams({
          ...userData, // Include all existing user data
          qrImageUrl: userData.qrImageUrl, // Append qrImageUrl
        }).toString();

        req.logIn(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          return res.redirect(`/profile?${queryParameters}`); // Redirect to the home page or any other desired page
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
