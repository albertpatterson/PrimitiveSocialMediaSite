var userController = require('../dataManagement/userController');
var router = require("express").Router();
var validateUser = require('./validateUser');
var setMessageCount = require('./setMessageCount');

// validate the user before attemtping to show content
router.use('*', validateUser);

// set the user's message count
router.use('*', setMessageCount);

// assuming the user is valid, show the home page
router.get('/', function(req, res, next){

    // get all of the user's followed post
    userController.getPosts(req.session.userName, 'followed')
    .then(function(results){
        // render the home page, including the followed posts 
        res.render('homePage.pug',  {
                                        latestPosts: JSON.stringify(results), 
                                        messageCount: req.session.messageCount
                                    });
    });
});

module.exports = router;