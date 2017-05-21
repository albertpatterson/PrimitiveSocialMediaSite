const ConcurrentRunner = require('./ConcurrentRunner');

class VeiwTestSuiteRunner extends ConcurrentRunner(){

    suiteSetup(){
        // start test server
    }

    setup(){
    }

    exercise(){
        // launch chrome window to run test
    }

    teardown(){
        // close browser if still open 
    }

    suiteTeardown(){
        // stop test server
    }
} 

module.exports = VeiwTestSuiteRunner;