const express=require("express");
const router=express.Router();
const wrapAysnc=require("../util/wrapAsync.js");
const { listingSchema,reviewSchema} = require("../schema.js");
const ExpressError=require("../util/expressError.js");
const Listing =require("../Model/listing.js");
const {islogged, isOwner,validateListing }=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const{storage}=require("../cloudConfig.js")
const upload = multer({storage});

router.route("/")
.get(wrapAysnc(listingController.index))
.post(islogged,
    validateListing,
    upload.single("listing[image]"),
    wrapAysnc(listingController.createListing));

// it will open form for new addition
router.get("/new", islogged,wrapAysnc(listingController.renderNewForm));

router.route("/:id")
.put(islogged,isOwner,
    upload.single("listing[image]"),validateListing,wrapAysnc(listingController.updateListing))
.get(wrapAysnc(listingController.showListing));


//it will open edit form
router.get("/:id/edit", wrapAysnc(listingController.renderEditForm));

// it will delete 
router.get("/:id/del",wrapAysnc(listingController.destroyListing));

module.exports=router;