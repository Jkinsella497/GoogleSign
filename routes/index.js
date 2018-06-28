var express = require('express');
var passport = require('passport');
var router = express.Router();
var GoogleStrategy = require('passport-google-auth').Strategy;  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Google routes
router.get('/auth/google',
  passport.authenticate('google', { 
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
}));


router.get('/oauthcallback', passport.authenticate('google', {  
  successRedirect: '/profile',
  failureRedirect: '/',
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}