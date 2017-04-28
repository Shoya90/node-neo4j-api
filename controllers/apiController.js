var express = require('express');
var router  = express.Router();
var passport = require('./authController');
var graph = require('../models/graph');

// GET: api/nodes
router.get('/nodes', ensureAuthentication, function(req, res){
  graph.getAllNodes(function(err, nodes){
    if(err) throw err;
    return res.json(nodes);
  });
});

// GET: api/paths
router.get('/paths', ensureAuthentication, function(req, res){
  graph.getAllPaths(function(err, paths){
    if(err) throw err;
    return res.json(paths);
  });
});

// POST: api/add/graph
router.post('/add/graph', ensureAuthentication, function(req, res){
  var nodes = req.body.nodes;
  var paths = req.body.paths;
  var building_id = req.body.building_id;
  var floor_num = req.body.floor_num;

  graph.createGraph(nodes, paths, building_id, floor_num, function(err){
    if(err) throw err;
    return res.send('created the graph!');
  })
});

// DELETE : api/delete/nodes
router.get('/delete/nodes', ensureAuthentication, function(req, res){
  graph.deleteAllNodes(function(err){
    if(err) throw err;
    return res.json('deleted all nodes');
  });
});

// DELETE : api/delete/paths
router.get('/delete/paths', ensureAuthentication, function(req, res){
  graph.deleteAllPaths(function(err){
    if(err) throw err;
    return res.json('deleted all paths');
  });
});

// POST: api/add/project
router.post('/add/project', ensureAuthentication, function(req, res){
    var project_name = req.body.project_name;

    graph.createProject(req.user.properties.email, project_name, function(err, project){
        if(err) throw err;
        return res.json(project);
    })
});

// POST: api/add/building
router.post('/add/building', ensureAuthentication, function(req, res){
    var project_id = req.body.project_id;
    var building_name = req.body.building_name;

    graph.createBuilding(project_id, building_name, function(err, building){
        if(err) throw err;
        return res.json(building);
    })
});

//AUTHENTICATE access
function ensureAuthentication(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.json('you are not logged in!');
}


module.exports = router;
