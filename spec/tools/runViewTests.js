const cp = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
const http = require('http');


// create a basic server to serve requested files
const topDir = '.'
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

// number of tests not yet complete
var remainingSpecs;

/**
 * run the testpoints captured in a spec funner file
 * 
 * @param {String} specRunnerPath the path to the spec runner file
 */
function runViewTests(specRunnerPaths){
     
    // allow a single spec to be speficied via a string
    if(typeof specRunnerPaths === 'string'){
        specRunnerPaths = [specRunnerPaths];
    }

    // initially none of the tests have been resovled
    remainingSpecs = specRunnerPaths.length;
    
    // start the test server and run each of the specs
    testServer.listen('8080', function(){
        for(specRunnerPath of specRunnerPaths){

            // run each spec and decrement the remaining specs once done
            // close the server if there ar no remaining specs
            runViewTest(
                specRunnerPath, 
                function(){
                    if(--remainingSpecs === 0){
                        console.log('Closing test server.')
                        testServer.close();
                    }
                })
        }
    })
}

// chrome application
const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

/**
 * run a single view test in chrome
 * 
 * @param {String} specRunnerPath the path to the spec to run
 * @param {Function} callback function to execute after the spec is complete
 */
function runViewTest(specRunnerPath, callback){
    // setup the temporary user dir then spawn a chrome process that uses it
    tearDown = setupTempUserDir(function(userDataDir){
        const chrome = cp.spawn(
                        chromePath,
                        [ '--incognito',
                            '--bwsi',
                            '--allow-insecure-localhost',
                            '--disable-web-security',
                            '--disable-popup-blocking',
                            `--user-data-dir=${userDataDir}`,
                            path.join('http://localhost:8080/', specRunnerPath)
                        ]);

        chrome.stdout.on('data', data=>console.log(`stdout ${data}`));
        chrome.stderr.on('data', data=>console.log(`strerr ${data}`));

        // the browser will close once the test completes teardown the temp user 
        // directory and execute the callback afterward
        chrome.on('close', function(code){
            console.log(`chrome closed with code ${code}`); 
            tearDown();
            callback()
        });
    })
}

// temporary location to store generated user data
const userDataBaseDir = 'C:\\Users\\apatters\\Documents\\junk';
// index of the current run, used to provide a unique user directory for each test run 
var count = 0;

/**
 * setup a temporary user directory
 * 
 * @param {Function} callback to execute once the director is setup
 * @returns {Function} teardown function to remove the temporary directory
 */
function setupTempUserDir(callback){
    // setup the directory and then execute callback
    let userDataDir = path.join(userDataBaseDir, (count++).toString());
    rimraf(userDataDir, function(){
        fs.mkdir(userDataDir, function(err){
            if(!(err===null)){
                console.log(err);
                return;
            }
            if(callback instanceof Function){
                callback(userDataDir);
            }
        })
    })
    // return the cleanup function
    return function(){
        rimraf(userDataDir, err=>{if(err){console.log(err)}});    
    }; 
}


module.exports = runViewTests;