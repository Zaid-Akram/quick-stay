const express = require("express");
const router = express.Router();
const { islogged } = require("../middleware.js");
const Listing = require("../Model/listing");
const Booking = require("../Model/booking");
const Review = require("../Model/reviews");
const User = require("../Model/user");

// My Information
router.get("/profile", islogged, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("guest/profile.ejs", { user});
});

// My Bookings
router.get("/bookings", islogged, async (req, res) => {
  // find all bookings that belong to the current user (by email)
  const bookings = await Booking.find({ email: req.user.email }).populate("listing");
  res.render("guest/bookings.ejs", { bookings });
});

// ✅ 3️⃣ My Reviews
router.get("/reviews", islogged, async (req, res) => {
  const reviews = await Review.find({ author: req.user._id }).populate("author");
  res.render("guest/reviews.ejs", { reviews });
});


router.delete("/bookings/:bookingId", islogged, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      req.flash("error", "Booking not found!");
      return res.redirect("/guest/bookings");
    }

    // Ensure only the user who made the booking can delete it
    if (booking.email !== req.user.email) {
      req.flash("error", "You are not authorized to cancel this booking!");
      return res.redirect("/guest/bookings");
    }

    // Remove booking reference from listing
    await Listing.findByIdAndUpdate(booking.listing, {
      $pull: { bookings: bookingId },
    });

    // Delete booking
    await Booking.findByIdAndDelete(bookingId);

    req.flash("success", "Booking cancelled successfully!");
    res.redirect("/guest/bookings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while cancelling the booking!");
    res.redirect("/guest/bookings");
  }
});

module.exports = router;
