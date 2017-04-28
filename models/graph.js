var neo4j = require('neo4j-driver').v2;
var driver = require('../config/config').neo4j_driver;
var uuid = require('uuid');
var _ = require('lodash');

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
graph.createGraph = function(nodes, paths, building_id, floor_num, callback) {
    session
        .run('CREATE (f:Floor {number: {floor_num}, id: {id}}) RETURN f', {floor_num: floor_num, id: uuid.v4()})
        .then(function(result){
            if(!_.isEmpty(result.records)){
                var floor_id = result.records[0]._fields[0].properties.id;
                session
                    .run("MATCH(b:Building {id: {building_id}}), (f:Floor {id : {floor_id}}) MERGE(b)-[r:HAS_FLOOR {id : {id}}]->(f)",
                        {
                            id : uuid.v4(),
                            building_id : building_id,
                            floor_id : floor_id
                        })
                    .then(function(result) {
                        var node_ids = [];
                        nodes.forEach(function(node) {
                            node_ids.push(uuid.v4());
                            session
                                .run("CREATE (a:Node {name: {name}, x: {x}, y: {y}, type: {type}, id : {id}}) RETURN a",
                                    {
                                        name: node.name,
                                        x: node.x,
                                        y: node.y,
                                        type : node.type,
                                        id : _.last(node_ids)
                                    })
                                .then(function(result) {
                                    var node_id = result.records[0]._fields[0].properties.id;
                                    session
                                        .run("MATCH(n:Node {id: {node_id}}), (f:Floor {id : {floor_id}}) CREATE(n)-[r:IS_ON_FLOOR {id : {id}}]->(f)",
                                            {
                                                id : uuid.v4(),
                                                node_id : node_id,
                                                floor_id : floor_id
                                            })
                                        .then(function (result) {
                                            session.close();
                                        })
                                        .catch(function (err) {
                                            if(err) throw err;
                                        });
                                })
                                .catch(function(err){
                                    console.log(err);
                                })
                        });

                        paths.forEach(function(path){
                            session
                                .run('MATCH(s:Node {name: {start_node}}), (e:Node { name: {end_node}}), (f:Floor {id: {floor_id}}) WHERE (s)-[r:IS_ON_FLOOR]->(f) return s,e',
                                    {start_node : path.startNode.name, end_node: path.endNode.name, floor_id: floor_id})
                                .then(function (result) {
                                    console.log(result.records[0]._fields[0], result.records[0]._fields[1]);
                                    if(!_.isEmpty(result.records)){
                                        session
                                            .run("MATCH(s:Node {id: {start_id}}), (e:Node {id : {end_id}}) CREATE(s)-[r:IS_CONNECTED {length : {length}, id : {id}}]->(e) RETURN s,e",
                                                {
                                                    length : path.length,
                                                    id : uuid.v4(),
                                                    start_id : result.records[0]._fields[0].properties.id,
                                                    end_id : result.records[0]._fields[1].properties.id
                                                })
                                            .then(function(result) {
                                                session.close();
                                            })
                                            .catch(function(err){
                                                console.log(err);
                                            });
                                    }
                                })
                                .catch(function (err) {
                                    if(err) throw err;
                                })
                        });

                    })
                    .catch(function(err){
                        console.log(err);
                    })
            }
            callback(null);
        })
        .catch(function(err){
            console.log(err);
        });

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

//CREATE NEW PROJECT
graph.createProject = function(email, project_name, callback) {
    return session
        .run('CREATE (p:Project {name : {project_name}, id : {p_id}}) RETURN p', {project_name: project_name , p_id : uuid.v4()})
        .then(function (result) {
            if(!_.isEmpty(result.records)){
                return session
                    .run("MATCH (u:User {email: {email}}), (p:Project {id: {p_id}}) CREATE (u)-[:HAS_PROJECT]->(p) RETURN p",
                        {
                            p_id : result.records[0]._fields[0].properties.id,
                            email : email
                        }
                    )
                    .then(function (result) {
                        return callback(null, result.records[0]._fields[0].properties);
                    })
                    .catch(function (err) {
                        if(err) throw err;
                    })

            }else{
                callback({msg : 'no such email!', status : 400}, null);
            }
        })
        .catch(function (err) {
            if(err) throw err;
        })

}

//CREATE NEW BUILDING
graph.createBuilding = function(project_id, building_name , callback) {
    return session
        .run('CREATE (b:Building {name : {building_name}, id : {id}}) RETURN b', {building_name: building_name , id : uuid.v4()})
        .then(function (result) {
            if(!_.isEmpty(result.records)){
                var building_id = result.records[0]._fields[0].properties.id;
                return session
                    .run("MATCH (b:Building {id: {building_id}}), (p:Project {id: {project_id}}) CREATE (p)-[:HAS_BUILDING]->(b) RETURN b",
                        {
                            building_id : building_id,
                            project_id : project_id
                        }
                    )
                    .then(function (result) {
                        return callback(null, result.records[0]._fields[0].properties);
                    })
                    .catch(function (err) {
                        if(err) throw err;
                    })

            }else{
                callback({msg : 'no such email!', status : 400}, null);
            }
        })
        .catch(function (err) {
            if(err) throw err;
        })

}

module.exports = graph;
