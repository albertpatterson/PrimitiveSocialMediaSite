var userController = require('../dataManagement/userController');
var router = require('express').Router();
var validateUser = require('./validateUser');
var setMessageCount = require('./setMessageCount');

// validate the user before attemtping to show content
router.use('*', validateUser);

// set the user's message count
router.use('*', setMessageCount);

/* GET home page. */
router.get('/', function(req, res, next) {
    
    // get the name of the user from the query
    name = req.query.name;
    
    // get the user's info and display the page
    userController.getUser(name)
    .then(function(doc){
        res.render( 'othersPage.pug', 
                    {   messageCount: req.session.messageCount,
                        name: doc.name,
                        age: _calculateAge(doc.dob), 
                        zip: doc.zip, 
                        business: doc.biz, 
                        picSrc: doc.pic,
                        canInteract: name!==req.session.userName
                    });
    });
});

function _calculateAge(dob) { // birthday is a date
    ms = new Date() - new Date(dob);
    return Math.floor(ms/(1000*60*60*24*365));
}

module.exports = router;
