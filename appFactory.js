const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const renderSignInPage = require('./routes/renderSignInPage.js');
const signInRouterFactory = require('./routes/signIn.js')
const signedInNavigationRouterFactory = require('./routes/signedInNavigation.js')
const signedInAjaxRouterFactory = require('./routes/signedInAjax.js')


function catch404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
}

/**
 * create the app for the primative social media site
 * 
 * @param {UserController} userController instance for interacting with the database
 * @returns {Object} app that performs routing for the primative social media site
 */
module.exports = function(userController){

    var app = express();
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session({
        secret: "pidb",
        resave: false,
        saveUninitialized: true
    }))

    // routes used in the primative social media site
    const signInRouter = signInRouterFactory(userController);
    const signedInNavigationRouter = signedInNavigationRouterFactory(userController);
    const signedInAjaxRouter = signedInAjaxRouterFactory(userController);
    app.use('/', renderSignInPage)
    app.use('/signIn', signInRouter)
    app.use('/signedIn/navigation', signedInNavigationRouter)
    app.use('/signedIn/ajax', signedInAjaxRouter)

    // catch 404 and forward to error handler
    app.use(catch404);

    // error handler
    app.use(errorHandler);

    // manage connection to the databaseManager
    app.connect = ()=>userController.databaseManager.connect();
    app.close = ()=>userController.databaseManager.close();
    
    return app;
};
