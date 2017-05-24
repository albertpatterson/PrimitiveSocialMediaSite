const ConcurrentSuiteRunner = require('./ConcurrentSuiteRunner');


class ViewTestSuiteRunner extends ConcurrentSuiteRunner{

    constructor(specs, serverTester, browserTesterFactory, resultsPromiseFactory, options){
        super(specs);
        this.serverTester = serverTester;
        this.browserTesterFactory = browserTesterFactory;
        this.resultsPromiseFactory = resultsPromiseFactory;

        this.resultsPromises = [];
        this.browserTesters = [];

        this.options = options || {};
    }

    suiteSetup(){
        const nSpecs = this.specs.length;
        for(let idx=0; idx<nSpecs; idx++){
            this.resultsPromises.push(this.resultsPromiseFactory());
            this.browserTesters.push(this.browserTesterFactory());
        }
        this.serverTester.serverManager.app.callback = this._passTestOutput.bind(this);
        return  this.serverTester.listen()
                .then(function(){
                    if(this.options.suiteSetup) return this.options.suiteSetup();
                }.bind(this))
    }

    pointSetup(idx){
        return this.options.setup?this.options.setup(idx):Promise.resolve();
    }

    exercise(exerciseArgs, setupResults){

        const specRunnerPath = exerciseArgs.spec;
        const idx = exerciseArgs.idx;

        console.log('exercise '+idx)

        const url = this.serverTester.getSpecUrl(`${specRunnerPath}?idx=${idx}`);
        const browserTester = this.browserTesters[idx];
        const resultsPromise = this.resultsPromises[idx];

        browserTester.open(url);

        return  resultsPromise.awaitResults();
    }

    pointTeardown(idx, exerciseResults){
        // console.log('teardown' + idx);
        // const browserTester = this.browserTesters[idx];
        // return  browserTester.close()
        //         .then(function(){
        //             if(this.options.teardown) return this.options.teardown();
        //         }.bind(this));  

        return this.options.setup?this.options.setup(idx):Promise.resolve();   
    }

    suiteTeardown(){

        return  Promise.all(this.browserTesters.map(bt=>bt.close()))
                .then(function(){
                    return this.serverTester.close();
                }.bind(this))
                .then(function(){
                    if(this.options.suiteTeardown) return this.options.suiteTeardown();
                }.bind(this))
    }

    _passTestOutput(testOutput){
        const idx = testOutput.idx;
        const results = testOutput.results;
        this.resultsPromises[idx].send(results);
    }
} 

module.exports = ViewTestSuiteRunner;