var databaseManager = require('../dataManagement/databaseManager');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('session')
  console.log(req.session)
  followerName = req.session.userName;
  followeeName = req.query.followeeName;
  databaseManager.followUser(followeeName, followerName, 
    function(err){
        console.log(err);
        res.send();
    })
});

module.exports = router;
