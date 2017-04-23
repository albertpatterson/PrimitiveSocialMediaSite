var userController = require('../dataManagement/userController').instance;
var router = require('express').Router();
var validateUser = require('./validateUser');

router.use('*', validateUser);

/* GET home page. */
router.get('/', function(req, res, next) {
    
    // get the name of the user from the query
    name = req.query.name;
    
    // get the user's info and display the page
    userController.getUser(name)
    .then(function(doc){
        var picServePath = doc.pic.slice(7, doc.pic.length);
        res.render( 'othersPage.pug', 
                    {   name: doc.name,
                        age: _calculateAge(doc.dob), 
                        zip: doc.zip, 
                        business: doc.biz, 
                        picSrc: picServePath});
    });
});

function _calculateAge(dob) { // birthday is a date
    ms = new Date() - new Date(dob);
    return Math.floor(ms/(1000*60*60*24*365));
}

module.exports = router;
