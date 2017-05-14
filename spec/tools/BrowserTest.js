const testServer = require('./testServer');
const execIf = require('./execIf');

class BrowserTest{

    constructor(browserLauncher, beforeFcn, afterFcn){
        this.browserLauncher = browserLauncher;
        this.beforeFcn = beforeFcn;
        this.afterFcn = afterFcn;
    }

    runTest(){
        return  Promise.resolve(execIf(this.beforeFcn))
                .then(function(){
                    return launchBrowserTest(this);
                }.bind(this))
                .then(function(){
                    return execIf(this.afterFcn);
                }.bind(this))
                .catch(function(err){
                    console.log(err)
                }.bind(this))    
    }

    static getSpecUrl(specPath){
        return testServer.getSpecUrl(specPath);
    }

    static beforeAll(){
        return testServer.listen('8080');
    }

    static afterAll(){
        testServer.close();
    }
}


function launchBrowserTest(test){
    return new Promise(function(res, rej){

        const browser = test.browserLauncher.launch();

        browser.stdout.on('data', data=>console.log(`stdout ${data}`));
        browser.stderr.on('data', data=>console.log(`strerr ${data}`));

        // the browser will close once the test completes teardown the temp user 
        // directory and execute the callback afterward
        browser.on('close', function(code){
            clearTimeout(failTimeout);
            console.log(`chrome closed with code ${code}`); 
            res();
        });

        const failTimeout = setTimeout(
            function(){
                browser.kill();
                rej("test did not complete within the timeout");
            },
            10e3
        );
    });
}

module.exports = BrowserTest;