
var Campgrounds= require("../models/campgrounds");
var Comments   = require("../models/comments");
var middlewareObj={};

middlewareObj.checkCampgroundsOwnership= function(req,res,next){
     if(req.isAuthenticated()){
          Campgrounds.findById(req.params.id, function(err,editcampgrounds){
            if(err){
              req.flash("error", "campgrounds not found");    
              res.redirect("back");
            }else{
                if(editcampgrounds.author.id.equals(req.user._id)){
                   next();
                }
                else{
                    req.flash("error", "you don't own this , not allowed to make changes");
                    res.redirect("back");
                }
          }
     });
    }  else{
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back");
      }

}

middlewareObj.checkCommentOwnership= function(req,res,next){
     if(req.isAuthenticated()){
          Comments.findById(req.params.comment_id, function(err, editComments){
            if(err){
              req.flash("error", "campgrounds not found");    
              res.redirect("back");
            }else{
                if(editComments.author.id.equals(req.user._id)){
                   next();
                }
                else{
                    req.flash("error", "you are not allowed to do changes");
                    res.redirect("back");
                }
          }
     });
    }  else{
        req.flash("error","you need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "you need to be logged in to do that");
    res.redirect("/login");
};
module.exports= middlewareObj;