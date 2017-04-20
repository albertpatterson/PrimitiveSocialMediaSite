var userController = require('../dataManagement/userController')();
var router = require('express').Router();

router.post('/',function(req, res, next){
    poster = req.session.userName;
    content = req.body.content;
    userController.addPost(poster, content)
    .then(function(){
        res.send(poster);
    });
});

module.exports = router;