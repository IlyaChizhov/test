'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    newer = require('gulp-newer'),
    csso = require('gulp-csso'), // минификатор CSS
    postcss = require('gulp-postcss'), // npm install --save-dev gulp-postcss
    autoprefixer = require('autoprefixer'), // npm install autoprefixer --save-dev
    watch = require('gulp-watch'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    connectPhp = require('gulp-connect-php'),
    fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync').create(),
    argv = require('yargs').argv,
    phpBin = '/usr/bin/php', //'C:/xampp/php/php.exe', //phpadress: '/usr/bin/php'
    prod = argv.prod, // минификация
    concat = require('gulp-concat');


var app_dir = 'app';
var wp_dir = './dest/';


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: wp_dir
        }
    });
});

gulp.task('server-php', function () {
    connectPhp.server({
        base: wp_dir,
        bin: phpBin,
        keepalive: true,
        hostname: 'localhost',
        port: 8000,
        open: true
    })
});

gulp.task('sass', function () {
    return gulp.src(app_dir + '/scss/**/*.scss')
        .pipe(gulpif(!Boolean(prod), sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer({browsers: ['last 5 versions']})]))
        .pipe(gulpif(Boolean(prod), csso()))
        .pipe(gulpif(!Boolean(prod), sourcemaps.write()))
        .pipe(gulp.dest(wp_dir + '/css'));
});

gulp.task('css', function () {
    return gulp.src(app_dir + '/scss/**/*.css')
        .pipe(gulp.dest(wp_dir + '/css'));
});

gulp.task('moveJs', function(){
  return gulp.src( app_dir + '/js/*.js')
        .pipe(gulpif(Boolean(prod), babel({
            presets: ['es2015']
        })))
        .pipe(gulpif(Boolean(prod), uglify()))
        // .pipe(concat('form.js'))
        .pipe(gulp.dest(wp_dir + '/js'));
});

gulp.task('moveHtml', function(){
    return gulp.src( app_dir + '/*.html')
            .pipe(fileinclude())
            .pipe(gulp.dest(wp_dir));
});

gulp.task('moveImg', function(){
    return gulp.src( app_dir + '/img/**.*')
            .pipe(gulp.dest(wp_dir + '/images'));
});

gulp.task('moveFonts', function () {
    return gulp.src( app_dir + '/fonts/**.*')
        .pipe(gulp.dest(wp_dir + '/fonts'));
})


gulp.task('watch', function () {
    gulp.watch(app_dir + '/scss/**/*.scss', gulp.series('sass'));
    gulp.watch(app_dir + '/scss/**/*.css', gulp.series('css'));
    gulp.watch(app_dir + '/js/*.js', gulp.series('moveJs'));
    gulp.watch(app_dir + '/**/*.html', gulp.series('moveHtml'));
    gulp.watch(app_dir + '/img/**/*.*', gulp.series('moveImg'));
    // gulp.watch(app_dir + '/**/*').on('change', browserSync.reload);
});

gulp.task('rebase', gulp.series(
    'moveHtml',
    'moveImg',
    'moveJs',
    'sass',
    'moveFonts',
    'css'
))

gulp.task('default', gulp.series('rebase', gulp.parallel('watch', 'browser-sync')));
