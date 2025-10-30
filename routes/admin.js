const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.js");
const { islogged } = require("../middleware");
const wrapAsync = require("../util/wrapAsync.js");


// Middleware to verify admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  req.flash("error", "Access denied! Admins only.");
  return res.redirect("/listings");
}

// Route
router.get("/dashboard", islogged, isAdmin, adminController.dashboard);
router.get("/users", islogged, isAdmin, adminController.listUsers);
router.delete("/users/:id", islogged, isAdmin, adminController.deleteUser);
router.get("/listings",islogged,isAdmin,adminController.listListings);
router.get("/bookings", islogged, isAdmin, adminController.listBookings);
router.get("/reviews", islogged, isAdmin, adminController.listReviews);
module.exports = router;
