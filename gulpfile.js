const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const karma = require('karma');
const Server = require('karma').Server;
const cp = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
// Run test once and exit
gulp.task('server test', function (done) {
    gulp.src(['spec/routes/**/*.js', 'spec/dataManagement/**/*.js'])
        .pipe(jasmine())
});

gulp.task('view test', function (done) {

  const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  const specRunnerPath = 'C:\\Users\\apatters\\OneDrive_personal\\OneDrive\\code\\socialMediaChanges\\addGulp\\PrimitiveSocialMediaSite\\spec\\views\\SpecRunner.html';
  const userDataDir = 'C:\\Users\\apatters\\Documents\\junk';
  
  rimraf(userDataDir, function(){
    fs.mkdir(userDataDir, function(err){
      if(!(err===null)){
          console.log(err);
          return;
      }
       const chrome = cp.spawn(
                        chromePath,
                        [ '--incognito',
                          '--bwsi',
                          '--allow-insecure-localhost',
                          '--disable-popup-blocking',
                          `--user-data-dir=${userDataDir}`,
                          specRunnerPath
                        ]);

            chrome.stdout.on('data', data=>console.log(`stdout ${data}`))
            chrome.stderr.on('data', data=>console.log(`strerr ${data}`))
            chrome.on('close', code=>console.log(`chrome closed with code ${code}`))
    })
  })
});