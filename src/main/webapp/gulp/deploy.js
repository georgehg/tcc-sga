'use strict';

var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');
var $ = require('gulp-load-plugins')();

gulp.task('deploy', ['clean'], function() {
    gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.babel({
        presets: ['env']
    }))
    .pipe($.ngAnnotate())
    .pipe($.sourcemaps.init())
    .pipe($.concat('sga-webapp-bundle.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(conf.paths.dist));
});