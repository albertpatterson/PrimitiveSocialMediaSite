// var userController = require('../dataManagement/userController');
// var multer = require('multer');
// var router = require('express').Router();

// router.post('/doSignIn', function(req, res, next){
//     // get the user name from the form 
//     userName = req.body.userName;
//     // todo: verify that the user name is valid
//     // store the user name in the session data
//     req.session.userName = userName;
//     // redirect the user to the home page
//     res.redirect("/signedIn/navigation/home");
// })

// router.post('/doSignUp',
//     multer({dest:'../public/images'}).single("pic"),
//     function(req, res, next){
//         var body = req.body;
//         var picPath = req.file.path;
//         // add the user
//         userController.addUser(body.userName, body.DOB, body.zip, body.biz, picPath)
//         .then(function(){                
//             // store the user name in the session data
//             req.session.userName = body.userName;
//             // redirect the user to their profile
//             res.redirect(`/signedIn/navigation/otherUser?name=${body.userName}`);
//         })
//         .catch(function(err){
//             res.send(err.message);
//         });
//     })

// router.get('/doSignOut', function(req, res, next){
//     req.session.userName = undefined;
//     res.redirect('/');   
// })

// module.exports = router;


module.exports = function(userController){
    const multer = require('multer');
    var router = require('express').Router();

    router.post('/doSignIn', function(req, res, next){
        // get the user name from the form 
        userName = req.body.userName;
        // todo: verify that the user name is valid
        // store the user name in the session data
        req.session.userName = userName;
        // redirect the user to the home page
        res.redirect("/signedIn/navigation/home");
    })

    router.post('/doSignUp',
        multer({dest:'../public/images'}).single("pic"),
        function(req, res, next){
            var body = req.body;
            if(req.file) var picPath = req.file.path;
            // add the user
            userController.addUser(body.userName, body.DOB, body.zip, body.biz, picPath)
            .then(function(){                
                // store the user name in the session data
                req.session.userName = body.userName;
                // redirect the user to their profile
                res.redirect(`/signedIn/navigation/otherUser?name=${body.userName}`);
            })
            .catch(function(err){
                res.send(err.message);
            });
        })

    router.get('/doSignOut', function(req, res, next){
        req.session.userName = undefined;
        res.redirect('/');   
    })

    return router;
};