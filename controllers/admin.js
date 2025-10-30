const User = require("../Model/user.js");
const Listing = require("../Model/listing.js");
const Booking = require("../Model/booking.js");
const Review = require("../Model/reviews.js");

module.exports.dashboard = async (req, res) => {
  try {
    // --- Summary counts ---
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: "host" });
    const totalGuests = await User.countDocuments({ role: "guest" });
    const totalListings = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    // --- Fetch recent data ---
    // Use lowercase 'owner' and 'listing' since that’s how they are defined in schemas
    const recentListings = await Listing.find({})
      .populate("owner") // matches your Listing model schema
      .sort({ _id: -1 })
      .limit(5);

    const recentBookings = await Booking.find({})
      .populate({
        path: "listing",
    populate: {
      path: "owner",
      model: "User",
      select: "username email",
    },
})
      .sort({ _id: -1 })
      .limit(5);

    res.render("admin/dashboard.ejs", {
      totalUsers,
      totalHosts,
      totalGuests,
      totalListings,
      totalBookings,
      totalReviews,
      recentListings,
      recentBookings,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error loading admin dashboard");
    res.redirect("/listings");
  }
};
// ✅ Show all users
module.exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.render("admin/users.ejs", { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    req.flash("error", "Unable to load users.");
    res.redirect("/admin/dashboard");
  }
};

// ✅ Delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash("success", "User removed successfully!");
    res.redirect("/admin/users");
  } catch (err) {
    console.error("Error deleting user:", err);
    req.flash("error", "Error deleting user.");
    res.redirect("/admin/users");
  }
};

// ✅ List all bookings
module.exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("guest", "username email")
      .populate({
        path: "listing",
        select: "title price location",
        populate: {
          path: "owner",
          select: "username",
        },
      })
      .sort({ _id: -1 });

    res.render("admin/bookings.ejs", { bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    req.flash("error", "Unable to load bookings.");
    res.redirect("/admin/dashboard");
  }
};

// ✅ List all reviews
module.exports.listReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("author", "username email")
      .populate({
        path: "listing",
        select: "title location",
        populate: { path: "owner", select: "username" },
      })
      .sort({ _id: -1 });

    res.render("admin/reviews.ejs", { reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    req.flash("error", "Unable to load reviews.");
    res.redirect("/admin/dashboard");
  }
};
module.exports.listListings = async (req, res) => {
  try {
    const listings = await Listing.find({}).populate("owner");
    res.render("admin/listings.ejs", { listings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    req.flash("error", "Unable to load listings.");
    res.redirect("/admin/dashboard");
  }
};

