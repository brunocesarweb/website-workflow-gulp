/*Var's**********************************************************************/
//gulp
  var gulp = require('gulp');
  var clean = require('gulp-clean');
  var usemin = require('gulp-usemin');
//HTML
  //var htmlReplace = require('gulp-html-replace');
  var htmlmin = require('gulp-htmlmin');
  var htmlimport = require('gulp-html-import');
//CSS
  var cssmin = require('gulp-cssmin');
  var csslint = require('gulp-csslint');
  var autoprefixer = require('gulp-autoprefixer');
  //var less = require('gulp-less');
//JS
  var uglify = require('gulp-uglify');
  var jshint = require('gulp-jshint');
  var jshintStylish = require('jshint-stylish');
  //var concat = require('gulp-concat');
//Img
  var imagemin = require('gulp-imagemin');
//Server
  var browserSync = require('browser-sync').create();
/*Var's**********************************************************************/

/*
    VERIFICAR SASS e SERVER
*/

//Task padrão que limpa o diretório dist e executa as funções padrão
gulp.task('default',['clean'], function() {
	gulp.start('usemin','build-img');
});

//Task de copy e clean
gulp.task('copy', ['clean'], function() {
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'));
});

//Task clean
gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});

//Task de otimização de imagem. Para que essa task rode junto da default ela não pode ter o parametro return
gulp.task('build-img', function() {
  gulp.src('src/assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('import', function () {
    gulp.src('./src/**/*.html')
        .pipe(htmlimport('./src/'))
        .pipe(gulp.dest('dist'));
})

//Task usemin que utiliza outras tasks do gulp
gulp.task('usemin', function() {
  return gulp.src('src/**/*.html')
    .pipe(usemin({
      html: [ function(){
        return htmlimport('./src/');
      }, function(){
        return htmlmin({collapseWhitespace: true});
      }],
      js: [uglify],
      css: [autoprefixer,cssmin]
    }))
    .pipe(gulp.dest('dist'));
});

//Task server que roda um servidor para acessar de outros dispositivos
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });

    gulp.watch('src/**/*').on('change', browserSync.reload);

    gulp.watch('src/assets/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish));
    });

    gulp.watch('src/assets/css/**/*.css').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());
    });

    gulp.watch('src/assets/less/**/*.less').on('change', function(event) {
       var stream = gulp.src(event.path)
            .pipe(less().on('error', function(erro) {
              console.log('LESS, erro compilação: ' + erro.filename);
              console.log(erro.message);
            }))
            .pipe(gulp.dest('src/css'));
    });
});
