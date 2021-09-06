var gulp = require("gulp");
var hashsrc = require("gulp-hash-src");
var clean = require("gulp-clean");
var inject = require("gulp-inject-string");
var index = function () {
  return gulp
    .src("build/index.html")
    .pipe(hashsrc({ build_dir: ".", src_path: "../js", exts: [".js"] }))
    .pipe(gulp.dest("publish"));
};
var copy = function () {
  return gulp.src(["build/**/*"]).pipe(gulp.dest("publish"));
};
var trash = function () {
  return gulp.src("publish", { read: false }).pipe(clean());
};
var date = function () {
  return gulp
    .src("publish/index.html")
    .pipe(inject.prepend("\n<!-- Updated: " + Date() + " -->"))
    .pipe(gulp.dest("publish"));
};

const build = gulp.series(trash, copy, index, date);
exports.default = build;
