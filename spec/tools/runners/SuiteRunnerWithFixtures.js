const RunnerWithFixtures = require('./RunnerWithFixtures');
const abstractMethod = require('../utils/abstractMethod');


/**
 * Runner of a suite of tests
 * 
 * @class SuiteRunnerWithFixtures
 */
class SuiteRunnerWithFixtures{

    /**
     * Creates an instance of SuiteRunnerWithFixtures.
     * @param {String[]} specs paths of the specs to run 
     * 
     * @memberOf SuiteRunnerWithFixtures
     */
    constructor(specs){
        this.specs = specs;
    }

    /**
     * method to run prior to setup or exercise for any testpoint, must return a promise
     * 
     * 
     * @memberOf SuiteRunnerWithFixtures
     */
    suiteSetup(){
        abstractMethod('suiteSetup');
    }

    /**
     * method to execute prior to each exercise in order to setup the environment, must return a promise
     * 
     * 
     * @memberOf SuiteRunnerWithFixtures
     */
    pointSetup(){
        abstractMethod('pointSetup');
    }

    /**
     * transform the suite of testpoints into a suite of tests, must return a promise
     * 
     * 
     * @memberOf SuiteRunnerWithFixtures
     */
    _runsuite(){
        abstractMethod('runsuite');
    }


    /**
     * method to execute after each exercise to restore the environment, must return a promise
     * 
     * 
     * @memberOf SuiteRunnerWithFixtures
     */
    pointTeardown(){
        abstractMethod('pointTeardown');
    }

    /**
     * method to run after completion and teardown of all testpoints, must return a promise
     * 
     * 
     * @memberOf SuiteRunnerWithFixtures
     */
    suiteTeardown(){
        abstractMethod('suiteTeardown');
    }

    /**
     * run the suite of tests
     * 
     * @returns {Promise} resolved when the suite of tests is complete
     * 
     * @memberOf SuiteRunnerWithFixtures
     */
    run(){
        const suiteRunner = new RunnerWithFixtures;
        suiteRunner.setup = this.suiteSetup.bind(this);
        suiteRunner.exercise = this._runSuite.bind(this);
        suiteRunner.teardown = this.suiteTeardown.bind(this);
        return suiteRunner.run();
    }
    
}

module.exports = SuiteRunnerWithFixtures;