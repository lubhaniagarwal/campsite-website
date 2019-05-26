var express    = require("express");
var router     = express.Router();
var passport   = require("passport");
var User       = require("../models/user");
var middleware = require("../middleware");




router.get("/", function(req, res){
    res.render("index");
});



router.get("/secret", middleware.isLoggedIn,function(req, res){
    res.render("secrets");
});

//register routes
router.get("/register", function(req,res){
   res.render("register"); 
});

router.post("/register", function(req,res){
    
    var newUser =new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        avatar:req.body.avatar,
        password:req.body.password
        
    });
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "welcome  "+ user.username);
            res.redirect("/campgrounds");
        });
    });
    
});


//login
router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res){
});

//logout

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/");
});






module.exports= router;