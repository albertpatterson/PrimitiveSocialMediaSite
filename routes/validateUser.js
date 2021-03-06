// var userController = require('../dataManagement/userController');
// var router = require('express').Router();

// router.use(function(req, res, next){
//     // check if there is a user by the provided name in the data base
    
//     if(typeof req.session.userName === "undefined"){
//         res.redirect('/');
//     }else{
//         userController.checkUser(req.session.userName)
//         .then(function(isValid){
//             if(isValid){
//                 // procede if the user is valid
//                 next();
//             }else{
//                 // redirect to the sign in page if there is no such user
//                 res.redirect('/');
//             }      
//         });
//     }
// });

// module.exports = router;


module.exports = function(userController){
    var router = require('express').Router();

    router.use(function(req, res, next){
        // check if there is a user by the provided name in the data base
        
        if(typeof req.session.userName === "undefined"){
            res.redirect('/');
        }else{
            userController.checkUser(req.session.userName)
            .then(function(isValid){
                if(isValid){
                    // procede if the user is valid
                    next();
                }else{
                    // redirect to the sign in page if there is no such user
                    res.redirect('/');
                }      
            });
        }
    });

    return router;
};