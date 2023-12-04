var express = require("express");
var router = express.Router();
const Events = require("../../models/event");
const Faq = require("../../models/Faq");
const Speaker = require("../../models/Speaker");

// Function to get month-wise data with duplicated entries based on count
async function getMonthWiseDataWithDuplicates() {
  try {
    // Aggregate data by month
    const monthWiseData = await Events.aggregate([
      {
        $group: {
          _id: "$month", // Group by the "month" field
          count: { $sum: 1 }, // Count the documents in each group
          events: {
            $push: {
              _id: "$_id",
              title: "$title",
              month: "$month",
              date: "$date",
              eventType: "$eventType",
              shortDescription: "$shortDescription",
              // Include any other event details you need here
            },
          }, // Collect documents in each group
        },
      },
      {
        $project: {
          _id: 1, // Exclude _id field
          month: "$_id", // Rename _id to month
          count: 1, // Include the count field
          events: 1, // Include the events field
        },
      },
      {
        $sort: {
          month: 1, // Sort by month in ascending order
        },
      },
      {
        $unwind: "$events", // Unwind the events array
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          month: 1, // Include the month field
          count: 1, // Include the count field
          events: 1, // Include the events field
        },
      },
    ]);

    return monthWiseData;
  } catch (error) {
    console.error("Error getting month-wise data with duplicates:", error);
    throw error;
  }
}

router.get("/", async function (req, res, next) {
  try {
    // Get all events
    const eventData = await Events.find();
    const speakerData = await Speaker.find();
    const faqData = await Faq.find();

    // Get month-wise data with duplicated entries
    const monthWiseData = await getMonthWiseDataWithDuplicates();

    res.render("calender", {
      eventData,
      speakerData,
      faqData,
      monthWiseData,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
