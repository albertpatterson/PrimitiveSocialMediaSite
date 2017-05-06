var userController = require('../dataManagement/userController');
var router = require('express').Router();
var validateUser = require('./validateUser');

router.use(validateUser);

router.get('/followUser', function(req, res, next) {
    
    followerName = req.session.userName;
    followeeName = req.query.followeeName;
    
    // add the user to the followed by list
    userController.followUser(followeeName, followerName)
    .then(function(){
        res.send();
    });
})

router.post('/postContent', function(req, res, next){
    var poster = req.session.userName;
    var content = req.body.content;
    var recipient = req.body.recipient;

    userController.addPost(poster, content, recipient)
    .then(function(){
        res.send(poster);
    });
})

module.exports = router;
