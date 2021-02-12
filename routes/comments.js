var express = require('express');
var router = express.Router({ mergeParams: true });
var Villa = require('../models/villa');
var Comment = require('../models/comment');
var middleware = require('../middleware');
// ============================
// COMMENTS ROUTES
// ============================
router.get('/', function (req, res) {
  res.render('landing');
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
  //find Villa by id
  Villa.findById(req.params.id, function (err, Villa) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { Villa: Villa });
    }
  });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
  // look up Villa using ID
  Villa.findById(req.params.id, function (err, Villa) {
    if (err) {
      req.flash('error', 'Something went wrong');
      console.log(err);
      res.redirect('/villas');
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // console.log(req.user.username);
          //save comment
          comment.save();
          Villa.comments.push(comment);
          Villa.save();
          console.log(comment);
          req.flash('success', 'Successfully added comment');
          res.redirect('/villas/' + Villa._id);
        }
      });
    }
  });
  // create new comments
  // connect new comment to Villa
  // redirect to Villa show page
});

//COMMENT EDIT ROUTE
router.get(
  '/:comment_id/edit',
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          Villa_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

//COMMENT UPDATE
router.put(
  '/:comment_id',
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      function (err, updatedComment) {
        if (err) {
          res.redirect('back');
        } else {
          res.redirect('/villas/' + req.params.id);
        }
      }
    );
  }
);

//comment delete
router.delete(
  '/:comment_id',
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
        res.redirect('back');
      } else {
        req.flash('success', 'Comment deleted');
        res.redirect('/villas/' + req.params.id);
      }
    });
  }
);

module.exports = router;
