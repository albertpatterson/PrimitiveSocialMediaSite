var router = require('express').Router();

router.get('/', function(req, res, next){
    req.session.userName = undefined;
    res.redirect('/signInOrUp');   
})

module.exports = router;
