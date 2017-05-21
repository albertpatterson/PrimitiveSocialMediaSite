/**
 * Helper to wait for, recieve and process results or to time out if results are not returned
 * soon enough
 * 
 * @class ResultsPromise
 * @property {}
 */
class ResultsPromise{
    /**
     * Creates an instance of ResultsPromise.
     * @param {Function} [processFcn] function that will be used to process the results when they are recieved
     * 
     * @memberOf ResultsPromise
     */
    constructor(processFcn){
        this._logResults = null;
        this._failureTimeout = null;
        this.processFcn = processFcn;
    }
    

    /**
     * send the results
     * 
     * @param {Object} results results of the test to be analyzed
     * 
     * @memberOf ResultsPromise
     */
    send(results){
        clearTimeout(this._failureTimeout);
        this._processResults({complete: true, data:results});
    }

    /**
     * await the arrival of test results and start the failure timeout
     * 
     * @param {Number} timeout maximum amout of time to wait for test results
     * @returns {Promise} resolved when the results are recieved or the timeout is reached
     * 
     * @memberOf ResultsPromise
     */
    awaitResults(timeout){
        timeout = timeout || 30e3;
        return new Promise(function(res){
            this._failureTimeout = setTimeout(this._timeout.bind(this), timeout);
            this._processResults = res;      
        }.bind(this))
        .then(function(results){
            this.processFcn(results);
        }.bind(this)); 
    }

    /**
     * process the results of the tests once they are recieved or the timeout is reached
     * 
     * 
     * @memberOf ResultsPromise
     */
    _processResults(){}

    /**
     * consider the test as having failed due to not returning results within the timeout
     * 
     * 
     * @memberOf ResultsPromise
     */
    _timeout(){
        this._processResults({complete: false, data:null});
    }
}

module.exports = ResultsPromise;