   var express               = require("express");
   var router                = express.Router();
  var Campgrounds            = require("../models/campgrounds");
  var middleware             = require("../middleware/index.js");
  
  
  
  
router.get("/campgrounds", function(req, res){ 
    var noMatch=null;
    if(req.query.search){
        const regex =new RegExp(escapeRegex(req.query.search),'gi');
        Campgrounds.find({name:regex}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else {
             if(allCampgrounds.length < 1){
                 noMatch="no campgrounds found, please try again.";
             }
             res.render("campgrounds",{Campgrounds:allCampgrounds, currentUser:req.user,noMatch:noMatch});
        }
    });
    }
    
    else{
           Campgrounds.find({}, function(err, allCampgrounds){
            if(err){
            console.log(err);
            }else {
             res.render("campgrounds",{Campgrounds:allCampgrounds, currentUser:req.user,noMatch:noMatch});
            }
    });
    }
   
});

router.get("/campgrounds/new", middleware.isLoggedIn,function(req,res){    
    res.render("new");
});

router.post("/campgrounds",middleware.isLoggedIn, function(req,res){
    
    var image=req.body.image;
    var price=req.body.price;
    var name =req.body.name;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newCampgrounds={
        name:name,
        price:price,
        image:image,
        description:description,
        author:author
    };
    Campgrounds.create(newCampgrounds,function(err,newCampgrounds){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "successfully added campground");
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/campgrounds/:id", function(req,res){

    Campgrounds.findById(req.params.id).populate("comments").exec(function(err, showCampgrounds){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("show",{campgrounds:showCampgrounds});
        }
    
    });
});


router.get("/campgrounds/:id/edit",middleware.checkCampgroundsOwnership,function(req,res){
          Campgrounds.findById(req.params.id, function(err,editcampgrounds){
               if(err){
                   console.log(err);
               }else{
                  
                   res.render("edit",{campgrounds:editcampgrounds});  
               }
     });
});
 

router.put("/campgrounds/:id",middleware.checkCampgroundsOwnership,function(req,res){
    Campgrounds.findByIdAndUpdate(req.params.id,req.body.camp, function(err, Allcampgrounds){
        if(err){
                res.redirect("/campgrounds/:id/:edit");
        }else{ 
                req.flash("success", "successfully edited campground");
                res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

router.delete("/campgrounds/:id",middleware.checkCampgroundsOwnership, function(req,res){
   Campgrounds.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           req.flash("success", "you have deleted this campground");
           res.redirect("/campgrounds");
       }
   }) ;
});


function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports= router;
