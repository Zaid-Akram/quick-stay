const express=require("express");
const router=express.Router();
const User=require("../Model/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const userControllers=require("../controllers/user.js")

router.get("/signup",userControllers.renderSignupForm);

router.post("/signup",wrapAsync(userControllers.signup));

router.get("/login", userControllers.renderLoginForm);


router.post("/login",passport.authenticate("local",{
     failureRedirect: "/login",
     failureFlash:true,
    }),userControllers.login);
    
router.get("/logout",userControllers.logout);


module.exports=router;