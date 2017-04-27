/**
 * Created by Shoya on 27/04/2017.
 */
var passport = require('passport');
var User = require('../models/users');

passport.serializeUser(function(user, done){
    console.log(user);
    done(null, user.properties.id);
});


//DESERIALIZE USER
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

module.exports = passport;