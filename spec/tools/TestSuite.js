const testServer = require('./testServer');
const execIf = require('./execIf');

class TestSuite{

    constructor(testPoints, options){
        this.testPoints = testPoints;
        this.beforeAll = null;
        this.afterAll = null;

        Object.assign(this, options);
    }

    runSequential(){
        return  Promise.resolve(execIf(this.beforeAll))
                .then(function(){
                    return this.testPoints.reduce(
                        function(test, testPoint){
                            return  test
                                    .then(function(){
                                        return testPoint.runTest();
                                    })
                    }, Promise.resolve());
                }.bind(this))
                .then(function(){
                    return execIf(this.afterAll);
                }.bind(this)) 
                .catch(function(err){
                    console.log(err)
                }.bind(this))                    
    }
}

module.exports = TestSuite;
