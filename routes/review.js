const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAysnc=require("../util/wrapAsync.js");
const ExpressError=require("../util/expressError.js");
const Listing =require("../Model/listing.js");
const Review=require("../Model/reviews.js")
const {validateReview, islogged, isOwner, isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js");

router.post("/",islogged, validateReview, wrapAysnc(reviewController.createReview));

//for Deleting review

router.delete("/:reviewId",islogged,isReviewAuthor,wrapAysnc(reviewController.destroyReview));

module.exports=router; 
