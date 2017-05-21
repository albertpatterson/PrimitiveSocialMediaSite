const BrowserTester = require('./BrowserTester');
const firefoxExePath = 'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe';

/**
 * tester of the firefox browser
 * 
 * @class FirefoxTester
 * @extends {BrowserTester}
 */
class FirefoxTester extends BrowserTester{
    /**
     * Creates an instance of FirefoxTester.
     * @param {String[]} processArgs arguments to supply when spawning th firefox process
     * 
     * @memberOf FirefoxTester
     */
    constructor(processArgs){
        super(firefoxExePath, processArgs);
    }
}

module.exports = FirefoxTester;