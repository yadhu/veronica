var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower'),
    rimraf = require('rimraf'),
    runSequence = require('run-sequence'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components',
    jsPath: './resources/js'
}


gulp.task('clean', function (cb) {
  rimraf('dist/assets/', cb);
});

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('css', function() {
    return gulp.src([
        config.sassPath + '/style.scss',
        config.sassPath + '/bootstrap.scss',
        config.bowerDir + '/fontawesome/scss/font-awesome.scss'
      ])
        .pipe(sass({
            style: 'compressed',
            loadPath: [
                './resources/sass',
                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                config.bowerDir + '/fontawesome/scss',
            ]
        })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('movejs', function() {
   gulp.src([
   	'./bower_components/jquery/dist/*.js',
   	'resources/js/*.js'
   	])
   .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('img-opt', function(){
  return gulp.src ('./resources/img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/assets/img'))
  });

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch('./resources/img/*', ['img-opt']);
    gulp.watch('resources/js/*.js', ['movejs']);
});

gulp.task('default', function() {
  runSequence('clean',
              ['bower', 'icons','css','movejs', 'img-opt']
              );
});
