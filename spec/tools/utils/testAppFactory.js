const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// create a basic server to serve requested files and receive results
const topDir = `${__dirname}/../..`

// map of file extensions to mime types
const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

/**
 * serve a file
 * 
 * @param {String} filePath the path to the desired file
 * @param {Response} res
 */
function serveFile(filePath, res){
    var mimeType = mimeTypes[path.extname(filePath).split(".")[1]];
    res.writeHead(200, {'Conetent-type': mimeType});
    fs.createReadStream(filePath).pipe(res);
}

/**
 * response with a failure message when a file is not found
 * 
 * @param {Sting} filePath the (invalid) path provided 
 * @param {Response} res 
 */
function serveFail(filePath, res){
    console.log("Requested non existent file: " + filePath);
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
}


/**
 * create a test app to listen for test results
 * 
 * @param {ResultsPromise} observer sends the test results for further analysis once they are received from the view
 * @returns {any} app defining the routing for the test app
 */
function testAppFactory(observer){
    observer = observer || process;
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('*', function(req, res, next){
        var filePath = path.join(topDir, req.url);
        fs.exists(filePath, function(exists){
            if(!exists) {
                serveFail(filePath, res);
                return;
            }
            serveFile(filePath, res);
        }) 
    })

    app.post('*', function(req, res, next){
        const results = req.body;
        console.log(results)
        observer.send(results);
    })

    return app;
}


module.exports = testAppFactory;