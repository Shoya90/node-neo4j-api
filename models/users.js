/**
 * Created by Shoya on 27/04/2017.
 */
var neo4j = require('neo4j-driver').v2;
var driver = require('../config/config').neo4j_driver;
var bcrypt = require('bcrypt');
var _ = require('lodash');
var uuid = require('uuid');

//DB CONNECTION
var session = driver.session();

var users = {};

//CREATE USER
users.createUser = function (user, callback) {
    return session
        .run('MATCH (user:User {email: {email}}) RETURN user', {email: user.email})
        .then(function (result) {
            if(!_.isEmpty(result.records)){
                 callback({msg : 'email already exists!', status : 400}, null);
            }else{
                return session
                    .run('CREATE (user:User {id: {id}, email: {email}, username: {username}, password: {password}}) RETURN user',
                        {
                            id : uuid.v4(),
                            email : user.email,
                            username : user.username,
                            password : user.password
                        }
                    )
                    .then(function (result) {
                        console.log(result);
                        return callback(null, result.records[0].get('user'));
                    })
                    .catch(function (err) {
                        if(err) throw err;
                    })
            }
        })
        .catch(function (err) {
            if(err) throw err;
        })
};

//GET USER BY EMAIL
users.getUserByEmail = function (email, callback) {
    return session
        .run('MATCH (user:User {email: {email}}) RETURN user', {email: email})
        .then(function(result){
            if(!_.isEmpty(result.records)){
                callback(null, result.records[0].get('user'));
            }else{
                callback({msg : 'email does not exist!', status : 400}, null);
            }
        })
        .catch(function (err) {
            if(err) throw err;
        })
}

//GET USER BY ID
users.findById = function(id, callback){
    return session
        .run('MATCH (user:User {id: {id}}) RETURN user', {id: id})
        .then(function (result){
            if(!_.isEmpty(result.records)){
                callback(null, result.records[0].get('user'));
            }else{
                callback({msg : 'user not found!', status : 400}, null);
            }
        })
        .catch(function (err) {
            if(err) throw err;
        })
}

users.hashPassword = function(password, callback) {
    bcrypt.hash(password, Math.random(), function (err, hash) {
        if(err) throw err;
        callback(null, hash);
    });
}

users.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}


module.exports = users;