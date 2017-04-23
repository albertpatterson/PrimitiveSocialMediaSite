const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
// Run test once and exit
gulp.task('test', function (done) {
    gulp.src('spec/**/*.js')
        .pipe(jasmine())
});