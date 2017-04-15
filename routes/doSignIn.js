var express = require("express");

var router = express.Router();

router.post('/', function(req, res, next){
    var body = req.body;
    console.log(body);

    userName = body.userName;
    setSessionUser(req, userName)
    console.log(req.session);
    // validate sign in 

    // get relevant data
    // render the relevant view
    //  mesasges
    //  followed content
    // res.render('homePage.pug',{})
    res.redirect("/home");
})

function setSessionUser(req, userName){
    req.session.userName = userName;
}

module.exports = router;