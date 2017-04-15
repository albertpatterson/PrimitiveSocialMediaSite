var databaseManager = require('../dataManagement/databaseManager');
var router = require('express').Router();
var validateUser = require('./validateUser');

router.use('*', validateUser);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('session')
  console.log(req.session)
  name = req.query.name;
  databaseManager.getUsers({name:name}).limit(1).toArray(function(err, results){

    if(results.length==1){
      var result = results[0];
      var picPath = result.pic;
      var picServePath = picPath.slice(7, picPath.length);
      res.render('othersPage.pug', { name: result.name, age: _calculateAge(result.dob), zip: result.zip, business: result.biz, picSrc: picServePath});
    }else{
      res.send("user " + name + " not found.")
    }
  })
});

function _calculateAge(dob) { // birthday is a date
    ms = new Date() - new Date(dob);
    return Math.floor(ms/(1000*60*60*24*365));
}

module.exports = router;
