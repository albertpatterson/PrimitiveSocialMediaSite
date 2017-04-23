var userController = require('../dataManagement/userController');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    
    followerName = req.session.userName;
    followeeName = req.query.followeeName;
    
    // add the user to the followed by list
    userController.followUser(followeeName, followerName)
    .then(function(){
        res.send();
    });
});

module.exports = router;
