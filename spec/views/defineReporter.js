define([], function(){
    return function(){
        if(location.protocol === "http:"){
            let results = '';
            jasmine.getEnv().addReporter(
            {
                specDone: function(result){
                    results += 'Spec: ' + result.description + ' was ' + result.status + '\n';
                
                    for(var i = 0; i < result.failedExpectations.length; i++) {
                        results += 'Failure: ' + result.failedExpectations[i].message +'\n';
                        results += result.failedExpectations[i].stack +'\n';
                    }
                
                    // console.log(result.passedExpectations.length);
                },

                jasmineDone: function(){
                    $.post('http://localhost:8080', results, function(){
                        window.close();
                    })
                }
            });
        }
    };
})