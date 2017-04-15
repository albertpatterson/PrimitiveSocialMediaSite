var databaseManager = require('../dataManagement/databaseManager');
var router = require('express').Router();

router.post('/', function(req, res, next){
    var pattern = req.body.pattern;
    filter = {name: new RegExp(pattern, 'i')}
    console.log('results');
    var cursor = databaseManager.getUsers(filter);
    matches = [];
    cursor.each(function(err, doc){
        console.log('err');
        console.log(err);
        console.log('doc');
        console.log(doc);
        if(doc){
            var picPath = doc.pic;
            var picServePath = picPath.slice(7, picPath.length);
            doc.picPath = picServePath;
            doc.age = _calculateAge(doc.dob);
            doc.page = '/otherUser?name='+doc.name;
            matches.push(doc);
        }else{
            res.render('searchResults.pug', {pattern: pattern, matches: matches})
        }
    })
})

function _calculateAge(dob) { // birthday is a date
    ms = new Date() - new Date(dob);
    return Math.floor(ms/(1000*60*60*24*365));
}

module.exports = router;