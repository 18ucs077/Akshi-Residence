var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  User = require('./models/user'),
  flash = require('connect-flash'),
  Villa = require('./models/villa'),
  Comment = require('./models/comment'),
  seedDB = require('./seeds');

var commentRoutes = require('./routes/comments'),
  VillaRoutes = require('./routes/villas'),
  authRoutes = require('./routes/auth');

mongoose.connect('mongodb://localhost/yelp_camp_v10'); //create yelpcamp db inside mongodb
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); seed the database

app.use(
  require('express-session')({
    secret: 'rusty wins',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', authRoutes);
app.use('/villas/:id/comments', commentRoutes);
app.use('/villas', VillaRoutes);

app.listen(4000, function () {
  console.log('Akshi Residencies server has started!');
});
