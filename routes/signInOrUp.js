var userController = require('../dataManagement/userController').instance;
var multer = require('multer');
var router =  require('express').Router();   

router.get('/', function(req, res, next){
    res.render('signInOrUp.pug');
})

router.post('/doSignUp', multer({dest:'../public/images'}).single("pic"), function(req, res, next){
    var body = req.body;
    var picPath = req.file.path;
    // add the user
    userController.addUser(body.userName, body.DOB, body.zip, body.biz, picPath)
    .then(function(){                
        // store the user name in the session data
        setSessionUser(req, body.userName);
        // redirect the user to their profile
        res.redirect(`/otherUser?name=${body.userName}`);
    })
    .catch(function(err){
        res.send(err.message);
    });
})

router.post('/doSignIn', function(req, res, next){
    // get the user name from the form 
    userName = req.body.userName;
    // todo: verify that the user name is valid
    // store the user name in the session data
    setSessionUser(req, userName);
    // redirect the user to the home page
    res.redirect("/home");
})

function setSessionUser(req, userName){
    req.session.userName = userName;
}

module.exports = router;