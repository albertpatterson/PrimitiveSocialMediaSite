const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const reporters = require('jasmine-reporters');
const cp = require('child_process')

path = require('path');

gulp.task('launch program', function(){
  // const databaseURL = require("../../../private/socialMediaDatabasePrivateURL");
  // const app = cp.fork('./bin/www', [databaseURL], {execArgv: ['--debug=9001', '--debug-brk']})
  // require('./bin/www')(require('../../../private/socialMediaDatabasePrivateURL'));
  // var appProcess = cp.fork('./bin/appChildProcessLauncher',['../../../../private/socialMediaDatabasePrivateURL'], {execArgv: ['--debug=5859']});
  var appProcess = cp.fork('./bin/launchAppServer.js')
})

// Run test once and exit
gulp.task('server test', function () {
    gulp.src(['spec/routes/**/*.js', 'spec/dataManagement/**/*.js'])
        .pipe(jasmine())
});

// run the view tests in the browser
gulp.task('view test', function (done) {

  const runViewTests = require('./spec/view/runViewTests');

  const specRunnerPaths = [                                                                                                                                                                                   
                            '/spec/views/displayPostsUnit.html'];

  runViewTests(specRunnerPaths, function (){console.log('done'); done()});
})

gulp.task("system test", function(){
  var appProcess = cp.fork('.//spec/system/runSystemTests.js');
})