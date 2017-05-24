// create the databaseManager
const DatabaseManager = require('../../dataManagement/DatabaseManager');
const testDbUrl = require('../../../../../private/socialMediaDatabasePrivateTestURL');
const databaseManager = new DatabaseManager(testDbUrl);

// create the userController
const UserController = require('../../dataManagement/UserController');
const userController = new UserController(databaseManager);

// create the resultsPromise
const ResultsPromise = require('../tools/utils/ResultsPromise');
const resultsPromise = new ResultsPromise();
resultsPromise.processFcn = function(results){
    if(results.complete){
        console.log('Test point complete:')
    }else{
        console.log('Test point incomplete:')
    }
    console.log(results.data);
}

// create the app that provides routing to source and test resources
const appWithTestAppFactory = require('../tools/utils/appWithTestAppFactory');
const appWithTestApp = appWithTestAppFactory(userController);

// create the server tester
const ServerTester = require('../tools/testers/ServerTester');
const serverTester = new ServerTester(appWithTestApp);

// create a tester for the chrome browser
const chromeTestProcessArgs = require('../tools/utils/chromeTestProcessArgs');
const ChromeTester = require('../tools/testers/ChromeTester');
const chromeTester = new ChromeTester(chromeTestProcessArgs);

// create a tester for the firefox browser
const firefoxTestProcessArgs = require('../tools/utils/FirefoxTestProcessArgs');
const FirefoxTester = require('../tools/testers/FirefoxTester');
const firefoxTester = new FirefoxTester(firefoxTestProcessArgs);


// paths of the spec runner files to include in the test suite
const specSuite = [ '/spec/system/specs/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    // '/spec/system/runners/loginSystem.html',
                    '/spec/system/specs/loginSystem222222.html']

// create the system level test runner
const SystemTestSuiteRunner = require('../tools/runners/SystemTestSuiteRunner');
const systemTestSuiteRunner = new SystemTestSuiteRunner(specSuite);

// set the necessary testers and options of the system level test runner
systemTestSuiteRunner.serverTester = serverTester;
systemTestSuiteRunner.resultsPromise = resultsPromise;
systemTestSuiteRunner.browserTester = chromeTester;
systemTestSuiteRunner.options = {setup: function(){return databaseManager.clearDatabase()}};

// run the tests on chrome
systemTestSuiteRunner.run()
.then(function(){
    // run the tests on firefox
    systemTestSuiteRunner.browserTester = firefoxTester;
    systemTestSuiteRunner.run();
})
