const SuiteRunnerWithFixtures = require('./SuiteRunnerWithFixtures');
const RunnerWithFixtures = require('./RunnerWithFixtures');

/**
 * Test suite runner that runs tests concurrently, multiple testpoints simultaneously
 * 
 * @class ConcurrentRunner
 * @extends {SuiteRunnerWithFixtures}
 */
class ConcurrentRunner extends SuiteRunnerWithFixtures{

    /**
     * transform the array of test points into a single promise, such that the
     * specs are run concurrently and the promise is resolve once they are all complete
     * 
     * @returns {Promise} resolved once all tests points are complete
     * 
     * @memberOf ConcurrentRunner
     */
    _runSuite(){
        let specRunner = new RunnerWithFixtures();
        specRunner.setup = this.pointSetup.bind(this);
        specRunner.exercise = this.exercise.bind(this);
        specRunner.teardown = this.pointTeardown.bind(this);

        // return Promise.all(this.specs.map((spec, idx)=>specRunner.run(`${spec}?idx=${idx}`)))
        return Promise.all(this.specs.map((spec, idx)=>specRunner.run(idx, {spec, idx}, idx)));
    }
}

module.exports = ConcurrentRunner;