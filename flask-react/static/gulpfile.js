var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    webserver = require('gulp-webserver'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    pathmodify  = require('pathmodify'),
    watchify = require('watchify'),
    path = require('path');


var BUILD_DIR = 'dist/';

function compile(watch) {
    var bundler = browserify('index.js', {
        debug: true,
        extensions: ['.js', 'jsx', '.json']
    });

    function bundle() {
        return bundler
            .plugin(pathmodify, {
                mods: [function (rec) {
                    if (rec.id[0] === '/' && !rec.id.startsWith(__dirname)) {
                        return {id: path.join(__dirname, rec.id.substr(1))};
                    }
                    return {};
                }]
            })
            .transform('babelify', {presets: ['es2015', 'react', 'stage-0']})
            .bundle()
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(BUILD_DIR));
    }

    if(watch){
        bundler = watchify(bundler)
            .on('update', bundle);
    }

    return bundle();
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


gulp.task('watch:js', function(){
    return compile(true);
});

gulp.watch('watch', ['webserver', 'watch:js']);