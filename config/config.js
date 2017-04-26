var neo4j = require('neo4j-driver').v1;

//NEO4J CONNECTION
var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'shoya'));
var port = process.env.PORT || 9000;

module.exports = {
                  neo4j_driver : driver,
                  port : port
                };
