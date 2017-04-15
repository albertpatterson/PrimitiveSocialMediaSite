var databaseManager = require('../dataManagement/databaseManager');
var router = require('express').Router();

router.all('*', function(req, res, next){
    // check if there is a user by the provided name in the data base
    databaseManager.checkUser(req.session.userName)
    .then(function(isValid){
        if(isValid){
            // procede if the user is valid
            next();
        }else{
            // redirect to the sign in page if there is no such user
            res.redirect('/signInOrUp');
        }      
    });
});

module.exports = router;


