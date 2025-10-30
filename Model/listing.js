const mongoose=require("mongoose");
//const { listingSchema } = require("../schema");
const Review=require("./reviews.js");

const schema=mongoose.Schema;

const listingSchema=new schema({
    title:{
      type: String,
      required:true,
    },
    description: String,
    image:{
        filename:String,
        url: String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
      type:schema.Types.ObjectId,
      ref:"Review",
    }],
    owner :{
      type:schema.Types.ObjectId,
      ref:"User",
    },
    // Listing model
bookings: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }
]

});

listingSchema.post("findOneAndDelte",async(listing)=>{
  if(listing)
      await Review.deleteMany({id:{$in:Listing.reviews}});
});

const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;

