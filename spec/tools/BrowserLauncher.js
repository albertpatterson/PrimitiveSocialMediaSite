const cp = require('child_process');

class BrowserLauncher{
    constructor(browserLocation, processArgs, url){
        this.browserLocation = browserLocation;
        this.processArgs =  processArgs;
        this.url = url;
    }

    launch(){
        return cp.spawn(this.browserLocation, [...this.processArgs, this.url]);
    }
}

module.exports = BrowserLauncher;