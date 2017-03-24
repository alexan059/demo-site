var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    browserSync = require('browser-sync').create();

gulp.task('preview-dist', function() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "docs"
        }
    });
});

gulp.task('delete-dist', ['icons'], function() {
    return del("./docs")
});

gulp.task('copy-files', ['delete-dist'], function() {
    var files = [
        './app/**/*',
        '!./app/index.html',
        '!./app/assets/images/**',
        '!./app/assets/styles/**',
        '!./app/assets/scripts/**',
        '!./app/temp',
        '!./app/temp/**'
    ];

    return gulp.src(files)
        .pipe(gulp.dest("./docs"));
});

gulp.task('optimize-images', ['delete-dist'], function() {
    return gulp.src([
            './app/assets/images/**/*',
            '!./app/assets/images/icons',
            '!./app/assets/images/icons/**/*'
        ])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest("./docs/assets/images"));
});

gulp.task('usemin-trigger', ['delete-dist'], function() {
    gulp.start('usemin')
});

gulp.task('usemin', ['styles', 'scripts'], function() {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [
                function() {return rev()},
                function() {return cssnano()}
                ],
            js: [
                function() {return rev()},
                function() {return uglify()}
            ]
        }))
        .pipe(gulp.dest("./docs"))
});

gulp.task('build', ['delete-dist', 'copy-files', 'optimize-images', 'usemin-trigger']);