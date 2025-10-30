const express = require("express");
const router = express.Router();
const User = require("../Model/user"); 
const { islogged } = require("../middleware");
const wrapAysnc=require("../util/wrapAsync.js");
const Listing=require("../Model/listing.js");

// Host profile route
router.get("/profile", islogged, async (req, res) => {
    try {
        const host = await User.findById(req.user._id); // get logged-in user
        res.render("host/profile", { host });
    } catch (e) {
        console.log(e);
        req.flash("error", "Cannot fetch profile");
        res.redirect("/host/dashboard");
    }
});
router.get("/dashboard", islogged,wrapAysnc(async (req, res) => {
  if (req.user.role !== "host") {
    req.flash("error", "Access denied! Hosts only.");
    return res.redirect("/listings");
  }
// Fetch host user details including notifications 
// today
    const host = await User.findById(req.user._id);
  // Fetch listings owned by this host
  const myListings = await Listing.find({ owner: req.user._id });
  res.render("host/dashboard.ejs", { myListings, host});
}));

module.exports = router;
