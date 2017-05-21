const BrowserTester = require('./BrowserTester');
const chromeExePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

/**
 * tester of the chrome browser
 * 
 * @class ChromeTester
 * @extends {BrowserTester}
 */
class ChromeTester extends BrowserTester{
    /**
     * Creates an instance of ChromeTester.
     * @param {String[]} processArgs arguments to supply when spawning the chrome process
     * 
     * @memberOf ChromeTester
     */
    constructor(processArgs){
        super(chromeExePath, processArgs);
    }
}

module.exports = ChromeTester;