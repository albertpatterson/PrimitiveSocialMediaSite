var router = require('express').Router();

router.get('/', function(req, res, next){
    res.render('signInOrUp.pug');
})

module.exports = router;