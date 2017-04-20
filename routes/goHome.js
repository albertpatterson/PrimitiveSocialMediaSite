var userController = require('../dataManagement/userController')();
var router = require("express").Router();
var validateUser = require('./validateUser');

// validate the user before attemtping to show the home page
router.use('*', validateUser);

// assuming the user is valid, show the home page
router.get('/', function(req, res, next){
    // get all of the user's followed post
    // todo: get messages
    userController.getFollowedPosts(req.session.userName)
    .then(function(followedPosts){
        // render the home page, including the followed posts 
        res.render('homePage.pug',{latestPosts: JSON.stringify(followedPosts)});
    });
});

module.exports = router;