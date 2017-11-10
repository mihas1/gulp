'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  sourcemaps = require('gulp-sourcemaps');


gulp.task('browser-sync', ['styles'], function () {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });
});

gulp.task('styles', function () {
  gulp.src(['app/styles/main.scss'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('app/styles/'))
    .pipe(browserSync.stream())
});

gulp.task('watch', function () {
  gulp.watch("app/styles/**/*.scss", ['styles']);

  gulp.watch("app/**/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);