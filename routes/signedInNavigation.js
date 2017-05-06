const userController = require('../dataManagement/userController');
var router = require('express').Router();
const validateUser = require('./validateUser');
const setMessageCount = require('./setMessageCount');
const calculateAge = require('./utils/calculateAge')

// validate that the sign in is valid
router.use(validateUser)

// update the number of messages
router.use(setMessageCount)


router.get('/home', function(req, res, next){
    // get all of the user's followed post
    userController.getPosts(req.session.userName, 'followed')
    .then(function(results){
        // render the home page, including the followed posts 
        res.render('homePage.pug',  {
                                        messageCount: req.session.messageCount,
                                        latestPosts: JSON.stringify(results)
                                    });
    });
})

router.get('/viewMessages', function(req, res, next){

    // get all of the user's followed post
    userController.getPosts(req.session.userName, 'message')
    .then(function(results){
        // render the home page, including the followed posts 
        res.render('homePage.pug',  {
                                        messageCount: req.session.messageCount,
                                        latestPosts: JSON.stringify(results) 
                                    });
    });
})

router.post('/doSearch', function(req, res, next){
    
    // filter the users by the pattern supplied in the text area
    var pattern = req.body.pattern;
    var filter = {name: new RegExp(pattern, 'i')};    
    
    // record information about each match, which will be used to render the page
    matches = [];
    userController.forEachUser(
        filter, 
        function(doc){
            doc.page = '/signedIn/navigation/otherUser?name='+doc.name;
            matches.push(doc);
        })
        .then(function(){
            // render the search results
            res.render('searchResults.pug',     {
                                                    messageCount: req.session.messageCount,
                                                    pattern: pattern, 
                                                    matches: matches
                                                })
        });
})

router.get('/otherUser', function(req, res, next) {

    // get the name of the user from the query
    name = req.query.name;
    
    // get the user's info and display the page
    userController.getUser(name)
    .then(function(doc){
        res.render( 'othersPage.pug', 
                    {   messageCount: req.session.messageCount,
                        name: doc.name,
                        age: calculateAge(doc.dob), 
                        zip: doc.zip, 
                        business: doc.biz, 
                        picSrc: doc.pic,
                        canInteract: name!==req.session.userName
                    });
    });
})

module.exports = router;