var express = require('express');
var router = express.Router(); //a new instance of express router and adding routes to this router.
var Villa = require('../models/villa');

var middleware = require('../middleware');

//INDEX ROUTE - show all villas
router.get('/', function (req, res) {
  // Get all villas from DB
  Villa.find({}, function (err, allvillas) {
    if (err) {
      console.log(err);
    } else {
      res.render('villas/index', {
        villas: allvillas,
        currentUser: req.user,
      }); //data + name passing in
    }
  });
});

//CREATE - add new villas to database
router.post('/', middleware.isLoggedIn, function (req, res) {
  // get data from form and add to villas array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var contact = req.body.contact;
  var desc = req.body.description;

  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newVilla = {
    name: name,
    price: price,
    image: image,
    contact: contact,
    description: desc,
    author: author,
  };
  //create a new Villa and save to db
  Villa.create(newVilla, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to villas page
      console.log(newlyCreated);
      res.redirect('/villas'); //
    }
  });
});

//NEW - show form to create new Villa
router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('villas/new');
});

//SHOW - shows more info about Villa selected - to be declared after NEW to not overwrite
router.get('/:id', function (req, res) {
  //find the Villa with the provided ID
  Villa.findById(req.params.id)
    .populate('comments')
    .exec(function (err, foundVilla) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that Villa
        res.render('villas/show', { Villa: foundVilla });
      }
    });
});

//EDIT Villa

router.get('/:id/edit', middleware.checkVillaOwnership, function (req, res) {
  //if user logged in?
  Villa.findById(req.params.id, function (err, foundVilla) {
    res.render('villas/edit', { Villa: foundVilla });
  });
});

//UPDATE Villa ROUTE

router.put('/:id', middleware.checkVillaOwnership, function (req, res) {
  //find and update the correct Villa
  Villa.findByIdAndUpdate(
    req.params.id,
    req.body.Villa,
    function (err, updatedVilla) {
      if (err) {
        res.redirect('/villas');
      } else {
        //redirect somewhere(show page)
        res.redirect('/villas/' + req.params.id);
      }
    }
  );
});

//DESTROY Villa

router.delete('/:id', middleware.checkVillaOwnership, function (req, res) {
  Villa.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/villas');
    } else {
      res.redirect('/villas');
    }
  });
});

module.exports = router; //returning/exporting router at the end
