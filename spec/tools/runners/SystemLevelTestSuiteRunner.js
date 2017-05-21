const SequentialSuiteRunner = require('./SequentialSuiteRunner');

/**
 * Test runner that provides a basic fixture that manages the server and browser process
 * and runs the testpoint defined in a specRunnerFile then logging the results to the console
 * 
 * @class SystemLevelTestSuiteRunner
 * @extends {SequentialRunner}
 */
class SystemLevelTestSuiteRunner extends SequentialSuiteRunner{

    /**
     * Creates an instance of SystemLevelTestSuiteRunner.
     * @param {ServerTester} serverTester the tester of the server
     * @param {BrowserTester} browserTester the tester of the browser
     * 
     * @memberOf SystemLevelTestSuiteRunner
     */
    constructor(specs, serverTester, browserTester, resultsPromise, options){
        super(specs);
        this.serverTester = serverTester;
        this.browserTester = browserTester;
        this.resultsPromise = resultsPromise;
        this.options = options;
    }

    /**
     * launch the server prior to running any testpoints
     * 
     * @returns {Promise} resolved when the server is launched
     * 
     * @memberOf SystemLevelTestSuiteRunner
     */
    suiteSetup(){
        return  this.serverTester.listen()
                .then(function(){
                    if(this.options.suiteSetup) return this.options.suiteSetup();
                }.bind(this))
    }

    /**
     * clear the database prior to running each testpoint
     * 
     * @returns {Promise} resolved when the database is cleard
     * 
     * @memberOf SystemLevelTestSuiteRunner
     */
    pointSetup(){
        return this.options.setup?this.options.setup():Promise.resolve();
    }

    /**
     * run the test defined in a particular spec runner and log the results to the console
     * 
     * @param {String} specRunnerPath path to the spec runner
     * @returns {Promise} resolved when results are recieved
     * 
     * @memberOf SystemLevelTestSuiteRunner
     */
    exercise(specRunnerPath){
        const url = this.serverTester.getSpecUrl(specRunnerPath);
        this.browserTester.open(url);

        return  this.resultsPromise.awaitResults();
    }

    /**
     * close the browser after each test
     * 
     * @returns {Promise} resolved when the process is killed
     * 
     * @memberOf SystemLevelTestSuiteRunner
     */
    pointTeardown(){
        return  this.browserTester.close()
                .then(function(){
                    if(this.options.teardown) return this.options.teardown();
                }.bind(this));        
    }

    /**
     * kill the server process after all tests are complete
     * 
     * @returns {Promise} resolved when the server process is killed
     * 
     * @memberOf SystemLevelTestSuiteRunner
     */
    suiteTeardown(){
        return  this.serverTester.close()
                .then(function(){
                    if(this.options.suiteTeardown) return this.options.suiteTeardown();
                }.bind(this))
    }
} 

module.exports = SystemLevelTestSuiteRunner;