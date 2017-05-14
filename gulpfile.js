const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const cp = require('child_process')

const runViewTests = require('./spec/tools/runViewTests');
path = require('path');

gulp.task('launch program', function(done){
  // const databaseURL = require("../../../private/socialMediaDatabasePrivateURL");
  // const app = cp.fork('./bin/www', [databaseURL], {execArgv: ['--debug=9001', '--debug-brk']})
  // require('./bin/www')(require('../../../private/socialMediaDatabasePrivateURL'));
  var appProcess = cp.fork('./bin/launchAppChildProcess',['../../../../private/socialMediaDatabasePrivateURL'], {execArgv: ['--debug=5859']});
})

// Run test once and exit
gulp.task('server test', function (done) {
    gulp.src(['spec/routes/**/*.js', 'spec/dataManagement/**/*.js'])
        .pipe(jasmine())
});

// run the view tests in the browser
gulp.task('view test', function (done) {

  const specRunnerPaths = [                                                                                                                                                                                   
                            '/spec/views/displayPostsUnit.html'];

  runViewTests(specRunnerPaths, function (){console.log('done'); done()});
})