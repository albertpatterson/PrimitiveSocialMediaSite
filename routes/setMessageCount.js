var userController = require('../dataManagement/userController');
var router = require('express').Router();

router.all('*', function(req, res, next){
    var userName = req.session.userName;
    userController.getMessageCount(userName)
    .then(function(count){
        req.session.messageCount = count;
        next();
    })
    
})

 module.exports =  router;