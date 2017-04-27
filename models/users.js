/**
 * Created by Shoya on 27/04/2017.
 */
var neo4j = require('neo4j-driver').v2;
var driver = require('../config/config').neo4j_driver;
var bcrypt = require('bcrypt');

//DB CONNECTION
var session = driver.session();

var users = {};

users.createUser = function (user, callback) {

}


module.exports = users;