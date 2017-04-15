var databaseManager = require('../dataManagement/databaseManager');
var router = require('express').Router();

router.post('/',function(req, res, next){
    poster = req.session.userName;
    content = req.body.content
    databaseManager.addPost(poster, content)
    .then(function(results){
        res.send(poster);
    })
})

module.exports = router;