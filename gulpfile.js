const gulp = require('gulp');
const ts = require('gulp-typescript');
const exec = require('child_process').exec;

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  exec("tsc --rootDir ./typescript", (err, stdout, stderr) => { 
      console.log(stdout);
      console.log(stderr);
  })
});

gulp.task('build', ['scripts'], () => {
    return gulp.src(['./typescript/**/*.json', './typescript/**/*.yaml'])
    .pipe(gulp.dest('./'));
})