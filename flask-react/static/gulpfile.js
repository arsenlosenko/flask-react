var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    webserver = require('gulp-webserver');


var BUILD_DIR = 'dist/';

function compile(){
    var bundler = browserify('index.js');
    return bundler
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(BUILD_DIR));
}


gulp.task('build:js', function(){
    return compile();
});

gulp.task('build', ['build:js']);


gulp.task('webserver', function(){
    return gulp.src(BUILD_DIR)
        .pipe(webserver({
            livereload : true
        }));
});

