// create the resultsPromise
const ResultsPromise = require('../tools/utils/ResultsPromise');

// paths of the spec runner files to include in the test suite
const specSuite =   [
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                        '/spec/view/specs/displayPostsUnit.html',
                    ];

// create a tester for the chrome browser
const chromeTestProcessArgs = require('../tools/utils/chromeTestProcessArgs');
const ChromeTester = require('../tools/testers/ChromeTester');

// the function used to process test results
const processFcn = function(results){
        if(results.complete){
            console.log('Test point complete:')
        }else{
            console.log('Test point incomplete:')
        }
        console.log(results.data);
}

// factories
const resultsPromiseFactory = ()=>new ResultsPromise(processFcn);
const chromeTesterFactory = ()=>new ChromeTester(chromeTestProcessArgs);

// create the app that provides routing to source and test resources
const testAppFactory = require('../tools/utils/testAppFactory');
const testApp = testAppFactory();

// create the server tester
const ServerTester = require('../tools/testers/ServerTester');
const serverTester = new ServerTester(testApp);

// create the view test runner
const ViewTestSuiteRunner = require('../tools/runners/ViewTestSuiteRunner');
const viewTestSuiteRunner = new ViewTestSuiteRunner(specSuite);

// set the necessary testers and options of the view test runner
viewTestSuiteRunner.serverTester = serverTester;
viewTestSuiteRunner.resultsPromiseFactory = resultsPromiseFactory;
viewTestSuiteRunner.browserTesterFactory = chromeTesterFactory;
viewTestSuiteRunner.options = {
    // create a user data directory for the testpoint
    pointSetup: function(idx){
        return  ChromeTester.getUserDataDir(idx)
                .then(function(dir){
                    const userDataDirDef = `--user-data-dir=${dir}`;
                    this.browserTesters[idx].processArgs = [...chromeTestProcessArgs, userDataDirDef];
                }.bind(this));
    }.bind(viewTestSuiteRunner),

    // remove the user data directory create for the testpoint
    pointTeardown: function(idx){
        return ChromeTester.removeUserDataDir(idx);
    }.bind(viewTestSuiteRunner)
};

// run the tests on chrome
viewTestSuiteRunner.run()
