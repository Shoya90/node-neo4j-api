var neo4j = require('neo4j-driver').v2;
var driver = require('../config/config').neo4j_driver;

//DB CONNECTION
var session = driver.session();

var graph = {};

//GET ALL NODES
graph.getAllNodes = function(callback){
  session
    .run('MATCH (n:Node) RETURN n')
    .then(function(result){
      var tmp = [];
      result.records.forEach(function(record){
        tmp.push({
          id : record._fields[0].identity.low,
          name : record._fields[0].properties.name,
          x : record._fields[0].properties.x,
          y : record._fields[0].properties.y,
          type : record._fields[0].properties.type
        });
      });
      callback(null, tmp);
    })
    .catch(function(err){
      console.log(err);
    })
}

//GET ALL PATHS
graph.getAllPaths = function(callback){
  session
    .run('MATCH (a)-[r:IS_CONNECTED]->(b) RETURN r')
    .then(function(result){
      var tmp = [];
      console.log(result);
      result.records.forEach(function(record){
        tmp.push({
          id : record._fields[0].identity.low,
          length : record._fields[0].properties.length,
          angle : record._fields[0].properties.angle
        });
      });
      callback(null, tmp);
    })
    .catch(function(err){
      console.log(err);
    })
}

//CREATE GRAPH
graph.createGraph = function(nodes, paths, callback) {
  nodes.forEach(function(node) {
    session
      .run("CREATE (a:Node {name: {name}, x: {x}, y: {y}})",
        {name: node.name,
         x: node.x,
         y: node.y,
         type : node.type
        })
      .then(function(result) {
        session.close();
      })
      .catch(function(err){
        console.log(err);
      })
  });

  paths.forEach(function(path){
    session
      .run("MATCH(s:Node {name: {start}}), (e:Node {name : {end}}) MERGE(s)-[r:IS_CONNECTED {length : {length}, angle : {angle}}]->(e) RETURN s,e",
        {length : path.length,
         angle : path.angle,
         start : path.startNode.name,
         end : path.endNode.name })
      .then(function(result) {
        session.close();
      })
      .catch(function(err){
        console.log(err);
      })
  })

  callback(null);
}

//DELETE ALL NODES
graph.deleteAllNodes = function(callback) {
  session
    .run('MATCH (n:Node) DELETE n')
    .then(function(result){
      callback(null);
    })
    .catch(function(err){
      res.json('first delete the relationships!');
      console.log(err);
    })
}

//DELETE ALL PATHS
graph.deleteAllPaths = function(callback) {
  session
    .run('MATCH (a)-[r:IS_CONNECTED]->(b) DELETE r')
    .then(function(result){
      callback(null);
    })
    .catch(function(err){
      console.log(err);
    })
}

module.exports = graph;
