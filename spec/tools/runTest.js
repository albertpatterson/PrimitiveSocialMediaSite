define(['jasmine-boot', 'defineReporter'], function(){
    // require the testFile defined globally
    require([testFile], function(){
        //trigger Jasmine
        window.onload();
    });
})