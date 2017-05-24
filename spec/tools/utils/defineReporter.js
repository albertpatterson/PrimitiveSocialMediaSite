/**
 * define a jasmine reporter that will record test results and then send them to the test server
 * once the test is complete
 * 
 * @module defineReporter
 */
define(['jquery','jasmine-boot'], function($){
    return function(){
        if(location.protocol === "http:"){
            // extract the test index if it was provided in the url
            const idxMatch = location.href.match(/.*\?idx=(.*)/);
            const idx = idxMatch?+idxMatch[1]:null;
            let results = '';
            jasmine.getEnv().addReporter(
                {
                    // record the spec result after each spec
                    specDone: function(result){
                        results += 'Spec: ' + result.description + ' was ' + result.status + '\n';
                    
                        for(var i = 0; i < result.failedExpectations.length; i++) {
                            results += 'Failure: ' + result.failedExpectations[i].message +'\n';
                            results += result.failedExpectations[i].stack +'\n';
                        }
                    },

                    // send the test results to the test server once the set of specs is complete
                    jasmineDone: function(){
                        // debugger
                        $.post('http://localhost:3000/spec', {idx, results}, function(){debugger})
                    }
                });
        }
    };
})