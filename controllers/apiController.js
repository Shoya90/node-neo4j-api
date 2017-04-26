var express = require('express');
var router  = express.Router();

var graph = require('../models/graph');

// GET: api/nodes
router.get('/nodes', function(req, res){
  graph.getAllNodes(function(err, nodes){
    if(err) throw err;
    return res.json(nodes);
  });
});

// GET: api/paths
router.get('/paths', function(req, res){
  graph.getAllPaths(function(err, paths){
    if(err) throw err;
    return res.json(paths);
  });
});

// POST: api/add/graph
router.post('/add/graph', function(req, res){
  var nodes = req.body.nodes;
  var paths = req.body.paths;

  graph.createGraph(nodes, paths, function(err){
    if(err) throw err;
    return res.send('created the graph!');
  })
});

// DELETE : api/delete/nodes
router.get('/delete/nodes', function(req, res){
  graph.deleteAllNodes(function(err){
    if(err) throw err;
    return res.json('deleted all nodes');
  });
});

// DELETE : api/delete/paths
router.get('/delete/paths', function(req, res){
  graph.deleteAllPaths(function(err){
    if(err) throw err;
    return res.json('deleted all paths');
  });
});



module.exports = router;
