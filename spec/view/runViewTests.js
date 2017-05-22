// create the resultsPromise
const ResultsPromise = require('../tools/utils/ResultsPromise');

const resultsPromiseFactory = function(){
    var resultsPromise = new ResultsPromise();
    resultsPromise.processFcn = function(results){
        if(results.complete){
            console.log('Test point complete:')
        }else{
            console.log('Test point incomplete:')
        }
        console.log(results.data);
    }
    return resultsPromise;
}


// create the app that provides routing to source and test resources
const testAppFactory = require('../tools/utils/testAppFactory');
const testApp = testAppFactory(resultsPromise);

// create the server tester
const ServerTester = require('../tools/testers/ServerTester');
const serverTester = new ServerTester(testApp);

// create a tester for the chrome browser
const chromeTestProcessArgs = require('../tools/utils/chromeTestProcessArgs');
const ChromeTester = require('../tools/testers/ChromeTester');
const chromeTesterFactory = ()=>new ChromeTester(chromeTestProcessArgs);

// create a tester for the firefox browser
const firefoxTestProcessArgs = require('../tools/utils/FirefoxTestProcessArgs');
const FirefoxTester = require('../tools/testers/FirefoxTester');
const firefoxTesterFactory = ()=>new FirefoxTester(firefoxTestProcessArgs);


// paths of the spec runner files to include in the test suite
const specSuite =   [
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        // '/spec/view/specs/displayPostsUnit.html',
                        // '/spec/view/specs/displayPostsUnit.html',
                        // '/spec/view/specs/displayPostsUnit.html',
                        // '/spec/view/specs/displayPostsUnit.html',
                    ];

// create the system level test runner
const ViewTestSuiteRunner = require('../tools/runners/ViewTestSuiteRunner');
const viewTestSuiteRunner = new ViewTestSuiteRunner(specSuite);

// set the necessary testers and options of the system level test runner
viewTestSuiteRunner.serverTester = serverTester;
viewTestSuiteRunner.resultsPromiseFactory = resultsPromiseFactory;
viewTestSuiteRunner.browserTesterFactory = chromeTesterFactory;

// run the tests on chrome
viewTestSuiteRunner.run()
.then(function(){
    // run the tests on firefox
    viewTestSuiteRunner.browserTesterFactory = firefoxTesterFactory;
    viewTestSuiteRunner.run();
})
