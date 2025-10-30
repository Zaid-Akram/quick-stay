const mongoose=require("mongoose");
const schema=mongoose.Schema;
const User=require("./user.js");
const Listing = require("./listing.js");


const reviewSchema=new schema({
    comment:String,
    rating:{
        type: Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now,
    },
    author:{
        type: schema.Types.ObjectId,
        ref:"User",
    },
    listing: {   // ✅ Add this field to link review to its listing
    type: schema.Types.ObjectId,
    ref: "Listing"
  },
});

const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;  