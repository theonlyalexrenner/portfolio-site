let assetsVersionReplace = require('gulp-assets-version-replace');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();
let clean = require('gulp-clean');
let cleanCSS = require('gulp-clean-css');
let gulp = require('gulp');
let rename = require("gulp-rename");
let sass = require('gulp-sass');
let uglify = require('gulp-uglify');
let version = require('gulp-rev');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {

    // Bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
        .pipe(gulp.dest('./vendor/bootstrap'));

    // Font Awesome
    gulp.src([
        './node_modules/@fortawesome/**/*',
    ])
        .pipe(gulp.dest('./vendor'));

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
        .pipe(gulp.dest('./vendor/jquery'));

    // jQuery Easing
    gulp.src([
        './node_modules/jquery.easing/*.js'
    ])
        .pipe(gulp.dest('./vendor/jquery-easing'))

});

// Compile SCSS
gulp.task('css:compile', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(version())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile']);

// Minify JavaScript
gulp.task('js:minify', function () {
    return gulp.src([
        './js/*.js',
        '!./js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(version())
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
});

gulp.task('assetsVersionReplace', function () {
    return gulp.src(['css/*.css', 'js/*.js'])
        .pipe(assetsVersionReplace({
            versionsAmount: 0,
            replaceTemplateList: [
                'index.html'
            ]
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('clean-scripts', function () {
    return gulp.src(['css/*.min.css', 'js/*.min.js', 'dist/*.js', 'dist/*.css'], {read: false})
        .pipe(clean());
});

// JS
// gulp.task('js', ['js:minify']);

// Default task
gulp.task('default', ['clean-scripts', 'css', 'vendor', 'assetsVersionReplace']);

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Dev task
gulp.task('dev', ['css', 'browserSync'], function () {
    gulp.watch('./scss/*.scss', ['css']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch('./*.html', browserSync.reload);
});
