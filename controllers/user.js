const User=require("../Model/user.js");

module.exports.renderSignupForm=(req, res)=>{
    res.render("signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
        let{email, username, password,role}=req.body;
        let newUser=new User({email,username,role});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","welcome to QuickStay");
        res.redirect("/login");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("login.ejs");
};

module.exports.login=(req,res)=>{
        req.flash("success","Welcome to QuickStay!");
        const role = req.user.role;
        
        if (role === "host") {
        res.redirect("/host/dashboard");  // host dashboard route
        } else if (role === "guest") {
            res.redirect("/listings");      // guest home page
        } else if (role === "admin") {
            res.redirect("/admin/dashboard"); // admin dashboard page
        } else {
            res.redirect("/listings");        // fallback
        }
};

module.exports.logout=(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logout");
        res.redirect("/listings")
    });
};


