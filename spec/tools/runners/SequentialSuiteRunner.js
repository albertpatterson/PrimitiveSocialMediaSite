const SuiteRunnerWithFixtures = require('./SuiteRunnerWithFixtures');
const RunnerWithFixtures = require('./RunnerWithFixtures');

/**
 * Test Suite runner that runs testpoints sequentially, one after the other
 * 
 * @class SequentialRunner
 * @extends {SuiteRunnerWithFixtures}
 */
class SequentialSuiteRunner extends SuiteRunnerWithFixtures{

    /**
     * transforms the array of test points into a chain of promises, each of which
     * is resolved after the corresponding testpoint is complete
     * 
     * @returns 
     * 
     * @memberOf SequentialSuiteRunner
     */
    runSuite(){
        let specRunner = new RunnerWithFixtures();
        specRunner.setup = this.pointSetup.bind(this);
        specRunner.exercise = this.exercise.bind(this);
        specRunner.teardown = this.pointTeardown.bind(this);

        // chain together testpoints
        return this.specs.reduce(
            function(suite, spec){
                return  suite
                        .then(function(){
                            return specRunner.run(spec);
                        }.bind(this))
            }.bind(this),
            Promise.resolve())
    }
}


module.exports = SequentialSuiteRunner;