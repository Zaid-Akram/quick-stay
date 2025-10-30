const Listing = require("./Model/listing");
const { listingSchema,reviewSchema} = require("./schema.js");
const ExpressError=require("./util/expressError.js");
const Review=require("./Model/reviews.js");

const islogged=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","do logged in ");
        return res.redirect("/login");
    }
    next();
}

module.exports={islogged};

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","you do not have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
}
// code has been changed from here
module.exports.isHost=async(req,res,next)=>{
    if (req.user.role === "host") 
        return next();
    req.flash("error", "You are not authorized to access this page");
    res.redirect("/login");
}
// till here

module.exports.validateListing = (req,res, next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>
            el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res, next)=>{
    let {error}=reviewSchema.validate(req.body);

    if(error){
        let {errMsg}=error.details.map((el)=>
            el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor= async(req, res, next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you do not create this comment");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
}