var gulp = require('gulp');
var jsmin = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('compress-js', function(){
  gulp.src('src/*.js')
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('compress-css', function(){
  gulp.src('src/*.css')
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['compress-js', 'compress-css']);