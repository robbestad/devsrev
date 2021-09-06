var gulp = require("gulp");
var hashsrc = require("gulp-hash-src");
var index = function () {
  return gulp
    .src("build/index.html")
    .pipe(hashsrc({ build_dir: ".", src_path: "../js", exts: [".js"] }))
    .pipe(gulp.dest("out"));
};
const build = gulp.series(index);
exports.default = build;
