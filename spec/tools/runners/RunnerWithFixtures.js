const validateFunction = require('./validateFunction');
const abstractMethod = require('../utils/abstractMethod');

/**
 * Runner of an exercise with a fixture for its setup and teardown
 * 
 * @class RunnerWithFixtures
 */
class RunnerWithFixtures{
   
    /**
     * method to establish the environment for the testpoint, must return a promise
     * 
     * @abstract
     * @memberOf RunnerWithFixtures
     */
    setup(){
        abstractMethod('setup');
    }

    /**
     * method to test the software, must return a promise
     * 
     * @abstract
     * @memberOf RunnerWithFixtures
     */
    exercise(){
        abstractMethod('exercise');
    }

    /**
     * method to restore the environment, must return a promise
     * 
     * @abstract
     * @memberOf RunnerWithFixtures
     */
    teardown(){
        abstractMethod('teardown');
    }

    /**
     * run the setup, exercise and then teardown
     * 
     * @returns {Promise} resolved once all three steps are complete
     * 
     * @memberOf RunnerWithFixtures
     */
    run(){
        // arguments to pass to the exercise function
        const exerciseArgs = Array.prototype.slice.call(arguments);

        return  this.setup()
                .then(function(){
                    return this.exercise.apply(this,exerciseArgs);
                }.bind(this))
                .then(function(){
                    return this.teardown();
                }.bind(this))                
                .catch(function(err){
                    console.log(err)
                }.bind(this))  
    }    
}

module.exports=RunnerWithFixtures;