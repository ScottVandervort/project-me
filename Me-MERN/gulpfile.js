var gulp = require('gulp');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var del = require('del');
var exec = require('child_process').exec;

gulp.task('build-client', ["clean-client"], function (cb) {

    // Change the working directory so that angualr-cli can find the process.
    process.chdir('client');

    exec('ng build --base-href /javascripts/', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log("done!");

            // Change bakc the f****** working directory of the process ....
            process.chdir('../');
            cb(err);             
    });
});

gulp.task('clean-client', function () {
    return del([
        'client/dist/**/*',
        'server/public/javascripts/**/*.bundle.js',
        'server/public/javascripts/**/*.bundle.js.*',
        'server/views/secure.hbs'
      ]);
});

gulp.task('copy-client', function() {    
    gulp.src([  
            'client/dist/**/*.js',
            'client/dist/**/*.map',
            'client/dist/**/*.ico'])
        .pipe(gulp.dest('server/public/javascripts'));

    gulp.src("client/dist/index.html")
        .pipe(rename("secure.hbs"))
        .pipe(gulp.dest("server/views"));         
});

gulp.task('build', function (callback) {

    runSequence('clean-client','build-client','copy-client', callback);    

});





