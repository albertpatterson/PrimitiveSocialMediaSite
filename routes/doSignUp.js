var databaseManager = require('../dataManagement/databaseManager');
var express = require('express');
var multer = require('multer');

var router = express.Router();

router.post('/',multer({dest:'./public/images'}).single("pic"), function(req, res, next){
    var body = req.body;
    var picPath = req.file.path;
    console.log(body);
    console.log(req.file)
    databaseManager.addUser(body.userName, body.DOB, body.zip, body.biz, picPath,
        function(err){
            if(err===null){

                userName = body.userName;
                console.log('user name is '+userName);
                setSessionUser(req, userName);
                console.log('session is')
                console.log(req.session);

                var picServePath = picPath.slice(7, picPath.length);
                res.render('othersPage.pug', { name: body.userName, age: _calculateAge(body.DOB), zip: body.zip, business: body.biz, picSrc: picServePath});

            }else{
                res.send("error: " + err.errmsg);
            }
        }
    )
})


function _calculateAge(dob) { // birthday is a date
    ms = new Date() - new Date(dob);
    return Math.floor(ms/(1000*60*60*24*365));
}

function setSessionUser(req, userName){
    req.session.userName = userName;
}

module.exports = router;