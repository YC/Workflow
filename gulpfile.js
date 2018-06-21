const gulp = require('gulp');
const typescript = require('gulp-typescript');
var exec = require('child_process').exec;

// Transpile Typescript
// Adapted from https://www.npmjs.com/package/gulp-typescript
const tsProject = typescript.createProject('src/tsconfig.json');
gulp.task('ts', () => {
    return gulp
        .src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('build'));
});

// Copy package.json
gulp.task('package.json', () => {
    return gulp.src('package.json').pipe(gulp.dest('build'));
});

// Copy test images
gulp.task('image', () => {
    return gulp.src('src/**/*.png')
        .pipe(gulp.dest('build'));
});

// Build frontend
// Adapted from gulp-exec documentation
gulp.task('react', callback => {
    exec(
        'npm run build --prefix app/ && rm -rf build/app\
        && mv app/build build/app',
        (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            callback(err);
        }
    );
});

// Build admin interface
gulp.task('admin', callback => {
    exec(
        'npm run build --prefix admin/ && rm -rf build/admin\
        && mv admin/build build/admin',
        (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            callback(err);
        }
    );
});

// Watch when in development
// Adapted from https://stackoverflow.com/questions/27645103
gulp.task('watch', gulp.parallel(function watch () {
    gulp.watch('src/**/*.ts', gulp.parallel('ts'));
    gulp.watch('package.json', gulp.parallel('package.json'));
    gulp.watch('src/**/*.png', gulp.parallel('image'));
}));

// Base
gulp.task('base', gulp.parallel('ts', 'package.json', 'image'));
// React
gulp.task('react', gulp.parallel('admin', 'react'));
// Default (build)
gulp.task('default', gulp.parallel('base', 'react'));
// Development (Default with watching of server files)
gulp.task('dev', gulp.series('default', 'watch'));
// Development (with watching of server files and excluding React builds)
gulp.task('devserver', gulp.series('base', 'watch'));
