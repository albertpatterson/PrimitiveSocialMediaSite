const cp = require('child_process');

/**
 * tester of the browser in which view and system tests are run
 * 
 * @class BrowserTester
 */
class BrowserTester{
    constructor(browserExePath, processArgs){
        this.browserExePath = browserExePath;
        this.processArgs = processArgs || [];
        this._process = null;
    }

    /**
     * open the browser to a given url
     * 
     * @param {String} url of the page to open in the browser
     * @returns {Promise} resolved after the browser process is spawned
     * 
     * @memberOf BrowserTester
     */
    open(url){
        // if(this._process){
        //     this.close();
        // }
        url = url || 'about:blank';
        this._process = cp.spawn(this.browserExePath, [url, ...this.processArgs]); 
        return Promise.resolve()
    }

    /**
     * close the browser window
     * 
     * @returns {Promisse} resolved when the browser process is killed
     * 
     * @memberOf BrowserTester
     */
    close(){
        return Promise.resolve(this._process.kill());
    }

    /**
     * add an event listener to the browser process
     * 
     * @param {String} eventName the name of the event
     * @param {Function} callback to be executed after the event is emitted
     * 
     * @memberOf BrowserTester
     */
    on(eventName, callback){
        this._process.on(eventName, function(){
            callback()
        });
    }
}

module.exports = BrowserTester;