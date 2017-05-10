const gulp = require('gulp');
const jasmine = require('gulp-jasmine');


const runViewTests = require('./spec/tools/runViewTests');
path = require('path');

// Run test once and exit
gulp.task('server test', function (done) {
    gulp.src(['spec/routes/**/*.js', 'spec/dataManagement/**/*.js'])
        .pipe(jasmine())
});

// run the view tests in the browser
gulp.task('view test', function (done) {

  const specRunnerPaths = [                                                                                                                                                                                   
                            '/spec/views/displayPostsUnit.html'];

  runViewTests(specRunnerPaths);
})


gulp.task('system test', function(done){

  // launch the app server
  // launch the test server
  // launch the runner window
  // 

})