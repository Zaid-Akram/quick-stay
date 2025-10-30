const Review=require("../Model/reviews.js");
const Listing=require("../Model/listing.js");

module.exports.createReview=async(req,res)=>{
     let id= req.params.id;
     let resul= await Listing.findById(id);
     let newReview= new Review(req.body.review);
     newReview.author=req.user._id
     resul.reviews.push(newReview);
     await newReview.save();
     await resul.save();
     res.redirect(`/listings/${id}`);

};

module.exports.destroyReview=async(req, res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};