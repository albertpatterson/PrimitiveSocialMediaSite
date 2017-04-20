var userController = require('../dataManagement/userController')();
var router = require('express').Router();

router.post('/', function(req, res, next){
    
    // filter the users by the pattern supplied in the text area
    var pattern = req.body.pattern;
    var filter = {name: new RegExp(pattern, 'i')};    
    
    // record information about each match, which will be used to render the page
    matches = [];
    userController.forEachUser(
        filter, 
        function(doc){
            var picPath = doc.pic;
            var picServePath = picPath.slice(7, picPath.length);
            doc.picPath = picServePath;
            doc.age = _calculateAge(doc.dob);
            doc.page = '/otherUser?name='+doc.name;
            matches.push(doc);
        })
        .then(function(){
            // render the search results
            res.render('searchResults.pug', {pattern: pattern, matches: matches})
        });
});

function _calculateAge(dob) { // birthday is a date
    ms = new Date() - new Date(dob);
    return Math.floor(ms/(1000*60*60*24*365));
}

module.exports = router;