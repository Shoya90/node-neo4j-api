var express = require('express');
var router  = express.Router();
var passport = require('passport');
var localStrategy  = require('passport-local').Strategy;

var user = require('../models/users');

router.post('/register', function (req, res) {
    var newUser = {};
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.password2 =  req.body.password2;
})