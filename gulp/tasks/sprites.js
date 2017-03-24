var gulp = require('gulp'),
    rename = require('gulp-rename'),
    del = require('del'),
    svgSprite =require('gulp-svg-sprite'),
    svg2png = require('gulp-svg2png');

var config = {
    shape: {
        spacing: {
            padding: 1
        }
    },
    mode: {
        css: {
            variables: {
                replaceSvgWithPng: function() {
                    return function(sprite, render) {
                        return render(sprite).split('.svg').join('.png');
                    }
                }
            },
            sprite: 'sprite.svg',
            render: {
                css: {
                    template: './gulp/templates/sprite.css'
                }
            }
        }
    }
};

gulp.task('create-png-copy', ['create-sprite'],function() {
    return gulp.src('./app/temp/sprite/css/*.svg')
        .pipe(svg2png())
        .pipe(gulp.dest('./app/temp/sprite/css'));
});

gulp.task('clean-begin-sprites', function() {
    del(['./app/assets/images/sprites']);
});

gulp.task('create-sprite', ['clean-begin-sprites'], function() {
    return gulp.src('./app/assets/images/icons/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('./app/temp/sprite'));
});

gulp.task('copy-sprite-graphic', ['create-png-copy'], function() {
    return gulp.src('./app/temp/sprite/css/**/*.{svg,png}')
        .pipe(gulp.dest('./app/assets/images/sprites'));
});

gulp.task('copy-sprite-css', ['create-sprite'], function() {
    return gulp.src('./app/temp/sprite/css/*.css')
        .pipe(rename('_sprite.css'))
        .pipe(gulp.dest('app/assets/styles/modules'))
});

gulp.task('clean-end-sprites', ['copy-sprite-graphic', 'copy-sprite-css'], function() {
    del(['./app/temp/sprite']);
});

gulp.task('icons', ['clean-begin-sprites', 'create-sprite', 'create-png-copy', 'copy-sprite-graphic', 'copy-sprite-css', 'clean-end-sprites']);