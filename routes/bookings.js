const express = require("express");
const router = express.Router({ mergeParams: true }); // merge listing id from parent route
const Booking = require("../Model/booking");
const Listing = require("../Model/listing");
const { islogged } = require("../middleware");
const User = require("../Model/user.js");  


// get route for booking
router.get("/",async(req,res)=>{
    let {id}=req.params;
    const aL=await Listing.findById(id)
    res.render("book.ejs",{aL});
});
// POST route for booking
router.post("/", islogged, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const { name, email, phone, checkin, checkout} = req.body.booking;

    // Calculate total price
    const inDate = new Date(checkin);
    const outDate = new Date(checkout);
    const days = (outDate - inDate) / (1000 * 60 * 60 * 24);

    if (days <= 0) {
      req.flash("error", "Invalid check-in and check-out dates!");
      return res.redirect(`/listings/${listing._id}`);
    }

    const totalPrice = days * listing.price;

    const newBooking = new Booking({
      listing: listing._id,
      // changes
      guest:req.user._id,
      //
      name,
      email,
      phone,
      checkin,
      checkout,
      totalPrice
    });

    await newBooking.save();
    // After saving newBooking
   listing.bookings.push(newBooking._id);
    await listing.save();
// changes
const host = await User.findById(listing.owner._id);
    host.notifications.push({
      message: `${req.user.username} booked your listing "${listing.title}".`
    });
    await host.save();
  //

    req.flash("success", "Booking confirmed successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while booking!");
    res.redirect("/listings");
  }
});

module.exports = router;
