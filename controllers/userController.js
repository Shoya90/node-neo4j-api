var express = require('express');
var router  = express.Router();
var passport = require('./authController');
var LocalStrategy  = require('passport-local').Strategy;

var User = require('../models/users');

//CREATE NEW USER
router.post('/register', function (req, res) {
    var newUser = {};

    newUser.username = req.body.username;
    newUser.email = req.body.email;
    User.hashPassword(req.body.password, function (err, hashed_password) {
        if(err) throw err;
        newUser.password = hashed_password;
        User.createUser(newUser, function (err, user) {
            if(err)
                return res.json(err.msg).end();
            return res.json(user);
        });
    });

});


//LOCAL LOGIN STRATEGY
passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            User.getUserByEmail(email , function(err, user){
                if(err)
                    return done(err);
                if(!user)
                    return done(null, false, req.flash('loginMessage', 'No User found'));
                User.comparePassword(password, user.properties.password, function (err, isMatch) {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }else{
                        console.log('invalid password');
                        return done(null, false, {message:'invalid password!'})
                    }
                });
            });
        });
    }
));


//LOGIN
router.post('/login',
    passport.authenticate('local-login'),
        function (req, res) {
            console.log('authentication succedded!');
            return res.json('you are logged in');
        }
);

//LOGOUT
router.get('/logout', function(req, res){
    req.logout();
    res.json('you are logged out!');
})

module.exports = router;