const ConcurrentSuiteRunner = require('./ConcurrentSuiteRunner');


class ViewTestSuiteRunner extends ConcurrentSuiteRunner{


    constructor(specs, testServerTester, browserTesterFactory, resultsPromiseFactory, options){
        super(specs);
        this.testServerTester = testServerTester;
        this.browserTesterFactory = browserTesterFactory;
        this.resultsPromiseFactory = resultsPromiseFactory;
        this.options = options || {};
    }

    suiteSetup(){
        return  this.serverTester.listen()
                .then(function(){
                    if(this.options.suiteSetup) return this.options.suiteSetup();
                }.bind(this))
    }

    pointSetup(){
        return this.options.setup?this.options.setup():Promise.resolve();
    }

    exercise(specRunnerPath){

        const url = this.serverTester.getSpecUrl(specRunnerPath);
        const browserTester = this.browserTesterFactory();
        const resultsPromise = this.resultsPromiseFactory();
        browserTester.open(url);

        return  resultsPromise.awaitResults()
                .then(function(){
                    return browserTester.close();
                })
                // .then(function(success){
                //     console.log(`closed: ${success}`)
                // })

    }

    pointTeardown(){
        return  this.options.teardown?this.options.teardown():Promise.resolve();
    }

    suiteTeardown(){
        return  this.serverTester.close()
                .then(function(){
                    if(this.options.suiteTeardown) return this.options.suiteTeardown();
                }.bind(this))
    }
} 

module.exports = ViewTestSuiteRunner;