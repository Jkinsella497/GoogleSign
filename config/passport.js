var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var User = require('../models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
      clientID: "1033509957163-oodvgg817disho8htkv56pjibmmo0o5r.apps.googleusercontent.com",
      clientSecret: '_SFLVWLfFCl-BszIDTrmcu1f',
      callbackURL: 'http://localhost:3000/oauthcallback',
    },
      function(token, refreshToken, profile, done) {
        process.nextTick(function() {
          User.findOne({ 'google.id': profile.id }, function(err, user) {
            if (err)
              return done(err);
            if (user) {
              return done(null, user);
            } else {
              var newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              newUser.save(function(err) {
                if (err)
                  throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }));
    };