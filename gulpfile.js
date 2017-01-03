/*Var's**********************************************************************/
//gulp
  var gulp = require('gulp');
  var clean = require('gulp-clean');
  var usemin = require('gulp-usemin');
//HTML
  var htmlmin = require('gulp-htmlmin');
  var htmlimport = require('gulp-html-import');
  //var htmlReplace = require('gulp-html-replace');
//CSS
  var cssmin = require('gulp-cssmin');
  var csslint = require('gulp-csslint');
  var autoprefixer = require('gulp-autoprefixer');
  var sass = require('gulp-sass');
//JS
  var uglify = require('gulp-uglify');
  var jshint = require('gulp-jshint');
  var jshintStylish = require('jshint-stylish');
  var pump = require('pump');
  var concat = require('gulp-concat');
//Img
  var imagemin = require('gulp-imagemin');
//Server
  var browserSync = require('browser-sync').create();
/*Var's**********************************************************************/

//Task padrão que limpa o diretório dist e executa as funções padrão
gulp.task('default',['clean'], function() {
	gulp.start('html','sass','js','img');
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

//Task que importa o html
gulp.task('html', function(){
  return gulp.src('src/templateHTML/**/*.html')
    .pipe(usemin({
      html: [function(){
        return htmlimport('./src/templateHTML/');
      }, function(){
        return htmlmin({collapseWhitespace: true});
      }]
  }))
  .pipe(gulp.dest('dist'));
});

//Sass
gulp.task('sass', function() {
  return gulp.src('./src/assets/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/assets/scss/'));
});

//Task usemin que utiliza outras tasks do gulp
//Se quiser gerar um arquivo único js é só descomentar a linha do concat
var filesJS = [
  'src/assets/js/jquery.js',
  'src/assets/js/home.js',
  'src/assets/js/ativa-filtro.js'
];
gulp.task('js', function() {
    return gulp.src(filesJS)
      //.pipe(concat('script.min.js'))
      .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});

//Task de otimização de imagem. Para que essa task rode junto da default ela não pode ter o parametro return
gulp.task('img', function() {
  gulp.src('src/assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'));
});

//Task server que roda um servidor para acessar de outros dispositivos
gulp.task('server', function() {

    browserSync.init({
      server: {
        baseDir: 'dist'
      },
      reloadDelay: 1500
    });

    gulp.watch('src/assets/scss/**/*.scss').on('change', function(event) {
       //var stream = 
       gulp.src(event.path)
            .pipe(sass().on('error', function(erro) {
              console.log('SCSS, erro compilação: ' + erro.filename);
              console.log(erro.message);
            }))
        gulp.start('sass');
    });

    gulp.watch('src/assets/js/**/*.js').on('change', function(event) {
        console.log("Linting javascript " + event.path);
        gulp.src(event.path)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish));
        gulp.start('js');

    });

    gulp.watch('src/**/*').on('change', browserSync.reload);

}); //server




/////////////////////////////////////////////////////////////////////////////


//Task usemin que utiliza outras tasks do gulp
//gulp.task('useminCSS', function() {
//    return gulp.src('src/assets/scss/**/*.scss')
//      .pipe(usemin({
//        //css: [autoprefixer,cssmin]
//        css: [autoprefixer,cssmin]
//      }))
//    .pipe(gulp.dest('dist/assets/scss/main.css'));
//});

//Primeira task do usemin, usado junto com o html quando este nao fica em um diretorio separado
//gulp.task('usemin', function() {
//  return gulp.src('src/**/*.html')
//    .pipe(usemin({
//      html: [function(){
//        return htmlimport('./src/');
//      }, function(){
//        return htmlmin({collapseWhitespace: true});
//      }],
//      js: [uglify],
//      css: [autoprefixer,cssmin]
//    }))
//    .pipe(gulp.dest('dist'));
//});