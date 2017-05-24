/**
 * run the jasmine test after defining the reporter
 * 
 * @module runTest
 */
define(['jquery', 'jasmine-boot', 'defineReporter'], function($, boot, defineReporter){
    // require the testFile defined globally
    require([testFile], function(){
        $(document).ready(function(){
            defineReporter();
            //trigger Jasmine
            window.onload();
        })
    });
})