const http = require('http');
const path = require('path');
const fs = require('fs');

// create a basic server to serve requested files and receive results
const topDir = `${__dirname}/../..`
const testServer = http.createServer(function(req, res){
    // serve files via the GET METHOD
    if(req.method === 'GET'){
        var filePath = path.join(topDir, req.url);
        fs.exists(filePath, function(exists){
            if(!exists) {
                serveFail(filePath, res);
                return;
            }
            serveFile(filePath, res);
        }) 
    // receive results via the POST method
    }else if(req.method === 'POST'){
        req.pipe(process.stdout);
        req.on('end', function(){
            res.end();
        })
    }
})

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

function testServerListen(port){
    return new Promise(function(res){
        testServer.listen(
            port, 
            function(){
                console.log(`test server listening on port ${port}`);
                res();
        });
    })
}

function testServerClose(port){
    return new Promise(function(res){
        testServer.close(
            function(){
                console.log(`test server closed`);
                res();
        });
    })
}

function getSpecUrl(specPath){
    return path.join('http://localhost:8080/', specPath)
}

module.exports = {listen: testServerListen, close: testServerClose, getSpecUrl};