var gulp = require('gulp');
var bs = require('browser-sync').create(); // create a browser sync instance.

gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', ['browser-sync'], function () {
    // gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("./*.html").on('change', bs.reload);
    gulp.watch("./js/index.js").on('change', bs.reload);
    gulp.watch("./css/style.css").on('change', bs.reload);
});