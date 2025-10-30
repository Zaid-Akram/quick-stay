
if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}
const express=require("express")

const app=express();

const mongoose=require("mongoose");

app.use(express.urlencoded({extended:true}));

const methodOverride = require("method-override");

const ejsMate=require("ejs-mate");

app.engine("ejs",ejsMate);

// Override using a query value, e.g. ?_method=DELETE
app.use(methodOverride("_method"));

//const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbURL=process.env.ATLASDB_URL
console.log("db url",dbURL);

const path=require("path");

app.set("view engine","ejs");

app.set("views", path.join(__dirname, "views"));

const { setDefaultHighWaterMark } = require("stream");

app.use(express.static(path.join(__dirname,"/public")));

const ExpressError=require("./util/expressError.js");
const { compile } = require("ejs");
const Review=require("./Model/reviews.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

const cookierParser=require("cookie-parser");

const session=require("express-session");
const flash=require("connect-flash");
const user=require("./routes/user.js");
const passport=require("passport");
const User=require("./Model/user.js");
const LocalStrategy=require("passport-local");
const Listing=require("./Model/listing.js");
// changes
const {islogged}=require("./middleware.js");
const wrapAsync = require('./util/wrapAsync.js');
const bookingRoutes = require("./routes/bookings.js");
const host=require("./routes/host.js");
const adminRoutes = require("./routes/admin.js");

const guestRoutes = require("./routes/guest.js");
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto :{
        secret : process.env.SECRET
    },
    touchAfter : 24*3600 // 24 hrs
})

store.on("error" , ()=>{
    console.log("mongo session error".err);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};



app.use(cookierParser());
app.use(session(sessionOption));
app.use(flash());
// for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
    .then(()=>{
       console.log("connect to db"); 
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbURL);
};

// middleware always reamin at bottom of the code
// Root route

app.use((req, res, next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

app.use("/",user)
app.use("/listings", listings);
app.use("/host",host);
app.use("/guest", guestRoutes);
app.use("/admin", adminRoutes);
app.use("/listings/:id/book", bookingRoutes);

app.use("/listings/:id/reviews",reviews);
app.use((err,req,res,next)=>{
    //console.log(err);
    let {status=500, message="what went wrong!"}=err;
    res.render("error.ejs",{message});
    //res.status(status).send(message);
});
app.listen(8080,()=>{
    console.log("server is listening on port");
});