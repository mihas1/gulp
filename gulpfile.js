var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-clean-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

// Пути к нашим внешним плагинам и библиотекам
var vendorJs = ['app/bower/jquery/dist/jquery.min.js'];

// Запускаем сервер. Предварительно выполнив три задачи ['styles', 'images', 'browserify']
// Сервер наблюдает за папкой "./dist". Здесь же наблюдаем и обновляем страничку стр. 25
gulp.task('browser-sync', ['html', 'styles', 'images', 'browserify', 'vendor-js'], function() {
  browserSync.init({
    server: {
       baseDir: "./dist"
    }
  });
  //browserSync.watch(['./**/*.*', '!**/*.css'], browserSync.reload);
});

// перенос и оптимизация картинок
gulp.task('images', function(){
  gulp.src('app/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img/'));
});

// перенос наших страничек
gulp.task('html', function(){
  gulp.src('app/pages/**/*.html')
    .pipe(gulp.dest('dist/'));
});

// Компиляция файлов стилей из папки app/scss/ и перенос в папку dist/css
gulp.task('styles', function(){
  gulp.src(['app/scss/main.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream())
});

//Модули CommonJS с помощью browserify. С минификацией
gulp.task('browserify', function () {
  return browserify({
      basedir: './app/js',
      entries: './main.js',
      debug: true
    })
    .bundle()
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/js'));
});

/* -------- concat vendor -------- */
gulp.task('vendor-js', function() {
  return gulp.src(vendorJs)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function () {
  gulp.watch("app/pages/**/*.html", ['html']);
  gulp.watch("app/scss/**/*.scss", ['styles']);
  gulp.watch("app/js/**/*.js", ['browserify']);
  gulp.watch("app/img/**/*.*", ['images']);

// Следим за продакшеном. То есть исходным кодом
  gulp.watch("dist/**/*.html").on('change', browserSync.reload);
  gulp.watch("dist/js/bundle.js").on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);

// Очистка папки dist
gulp.task('clean', function() {
  del(['dist'], {
    force: true
  }).then(paths => {
    console.log('Deleted files and folders: in dist');
  });
});