const cp = require('child_process');

class BrowserTestRunner{
    constructor(browserLocation, processArgs, url){
        this.browserLocation = browserLocation;
        this.processArgs =  processArgs;
        this.url = url;
    }

    runTest(test){
        return new Promise(function(res, rej){

            const browser = launchBrowser(this);

            browser.stdout.on('data', data=>console.log(`stdout ${data}`));
            browser.stderr.on('data', data=>console.log(`strerr ${data}`));

            // the browser will close once the test completes teardown the temp user 
            // directory and execute the callback afterward
            browser.on('close', function(code){
                clearTimeout(failTimeout);
                console.log(`browser closed with code ${code}`); 
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

}

function launchBrowser({browserLocation, processArgs, url}){
    return cp.spawn(browserLocation, [...processArgs, url]);
}

module.exports = BrowserLauncher;