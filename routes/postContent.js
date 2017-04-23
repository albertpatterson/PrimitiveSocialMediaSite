var userController = require('../dataManagement/userController');
var router = require('express').Router();
var validateUser = require('./validateUser');
var setMessageCount = require('./setMessageCount');

// validate the user before attemtping to show content
router.use('*', validateUser);

// set the user's message count
router.use('*', setMessageCount);

router.post('/',function(req, res, next){
    var poster = req.session.userName;
    var content = req.body.content;
    var recipient = req.body.recipient;

    userController.addPost(poster, content, recipient)
    .then(function(){
        res.send(poster);
    });

});

module.exports = router;