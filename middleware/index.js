var middlewareObj = {};
var Villa = require('../models/villa');
var Comment = require('../models/comment');

middlewareObj.checkVillaOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Villa.findById(req.params.id, function (err, foundVilla) {
      if (err) {
        req.flash('error', 'Villa not found');
        res.redirect('back');
      } else {
        //does user own the Villa?
        console.log(foundVilla.author.id); //it is a mongoose object
        console.log(req.user.id); //it is a string
        //therefore we cannot compare them by == or ===
        if (foundVilla.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please Login first!');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        //does user own the comment?
        console.log(foundComment.author.id); //it is a mongoose object
        console.log(req.user.id); //it is a string
        //therefore we cannot compare them by == or ===
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please login first');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  //middleware to check about logged in or not

  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Login First!');
  res.redirect('/login');
};

module.exports = middlewareObj;
