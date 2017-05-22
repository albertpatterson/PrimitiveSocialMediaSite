const express = require('express');
const appFactory = require('../../../appFactory');
const testAppFactory = require('./testAppFactory');

/**
 * apply middleware unless the route path begins with a given prefix
 * 
 * @param {String} pathPrefix the path prefix to exclude 
 * @param {Function} middleware the function to use if the route path does not begin with pathPrefix
 * @returns {any} output of corresponding middleware function
 */
var unlessBeginsWith = function(pathPrefix, middleware) {
    return function(req, res, next) {
        if (req.path.indexOf(pathPrefix)==0){
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

/**
 * create an app that combines the app under tests and the app that serves test resources
 * 
 * @param {any} userController 
 * @param {any} observer 
 * @returns {any} app that supplied routing for the software under test and for test resources
 */
function appWithTestAppFactory(userController, observer){
    const app = appFactory(userController);
    const testApp = testAppFactory(observer);

    var appWithTestApp = express();
    // unless the route path begins '/spec', serve the app under test
    appWithTestApp.use(unlessBeginsWith('/spec', app));
    // if the route path begins with '/spec/ serve the test resources
    appWithTestApp.use(testApp);

    appWithTestApp.connectToDatabase = app.connectToDatabase.bind(app);
    appWithTestApp.closeDatabaseConnection = app.closeDatabaseConnection.bind(app);

    return appWithTestApp;
}

module.exports = appWithTestAppFactory;