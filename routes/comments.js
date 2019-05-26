var express = require("express");
var router  = express.Router({mergeParams: true});
var Comments= require("../models/comments");
var Campgrounds= require("../models/campgrounds");
var middleware = require("../middleware");


router.get("/new",middleware.isLoggedIn, function(req,res){
    console.log(req.params.id);
     Campgrounds.findById(req.params.id, function(err, campgrounds){
         if(err){
             console.log(err);
         }else{
              res.render("comments/new", {campgrounds:campgrounds});
         }
     });
});

router.post("/",middleware.isLoggedIn, function(req,res){
    
    Campgrounds.findById(req.params.id, function(err, campground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           Comments.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               }else{
                   
                   comment.author.id= req.user._id;
                   comment.author.username=req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "successfully added comment");
                   res.redirect("/campgrounds/"+req.params.id);
               }
           });
       }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comments.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
               
               res.render("comments/edit",{campgrounds_id:req.params.id, comment:foundComment});
        }
    });
 
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "successfully edited comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
        
    });
});

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
   Comments.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
           res.redirect("back");
       }else{
           req.flash("success", "you have deleted this comment");
           res.redirect("/campgrounds/"+req.params.id);
       }
   });
});

module.exports= router;