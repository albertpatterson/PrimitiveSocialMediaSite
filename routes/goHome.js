var databaseManager = require('../dataManagement/databaseManager');
var router = require("express").Router();

router.get('/', function(req, res, next){
    console.log('session');
    console.log(req.session);
    var userName = req.session.userName;
    if(userName){
        databaseManager.getFollowedPosts(userName)
        .then(function(followedPosts){
            res.render('homePage.pug',{latestPosts: JSON.stringify(followedPosts)});
        })
    }else{
        res.redirect('/signInOrUp')
    }
})

module.exports = router;