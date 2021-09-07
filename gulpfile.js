let gulp = require("gulp");
let hashSrc = require("gulp-hash-src");
let clean = require("gulp-clean");
let injectString = require("gulp-inject-string");
let index = function () {
  return gulp
    .src("build/index.html")
    .pipe(hashSrc({ build_dir: ".", src_path: "../js", exts: [".js"] }))
    .pipe(gulp.dest("publish"));
};
let copy = function () {
  return gulp.src(["build/**/*"]).pipe(gulp.dest("publish"));
};
let trash = function () {
  return gulp.src("publish", { read: false }).pipe(clean());
};
let date = function () {
  return gulp
    .src("publish/index.html")
    .pipe(injectString.prepend("\n<!-- Updated: " + Date() + " -->"))
    .pipe(gulp.dest("publish"));
};

const build = gulp.series(trash, copy, index, date);
const buildGithub = gulp.series(copy, index, date);
exports.default = build;
exports.github = buildGithub;
