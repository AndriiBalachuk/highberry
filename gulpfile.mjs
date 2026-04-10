import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as sassCompiler from "sass";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import imagemin from "gulp-imagemin";
import sourcemaps from "gulp-sourcemaps";
import { deleteAsync } from "del";
import ttf2woff from "gulp-ttf2woff";
import babel from "gulp-babel";
import fileInclude from "gulp-file-include";
import browserSyncLib from "browser-sync";

const browserSync = browserSyncLib.create();
const sass = gulpSass(sassCompiler);
const path = {
  build: {
    pages: "./dist/",
    css: "./dist/css/",
    js: "./dist/js/",
    // img: "./dist/img",
    fonts: "./dist/fonts",
    libs: "./dist/libs/",
  },

  src: {
    pages: "./src/*.html",
    css: "./src/scss/**/*.scss",
    js: "./src/js/main.js",
    // img: "./src/img/**/*.{jpg,jpeg,png,gif,webp,svg}",
    fonts: "./src/fonts/*.{ttf,otf}",
    libs: "./src/libs/**/*.*",
  },

  watch: {
    pages: "./src/**/*.html",
    css: "./src/scss/**/*.scss",
    js: "./src/js/**/*.js",
    // img: "./src/img/**/*.{jpg,jpeg,png,gif,webp,svg}",
    fonts: "./src/fonts/*.{ttf,otf}",
    libs: "./src/libs/**/*.*",
  },
};

function html() {
  return gulp
    .src(["src/pages/*.html", "!src/pages/_*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}
function style() {
  return (
    gulp
      .src(path.src.css)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(path.build.css))
      ///////////////////////////////////

      .pipe(browserSync.stream())
  );
}
function styleMin() {
  return gulp
    .src("dist/css/style.css")
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(path.build.css));
}

function scripts() {
  return gulp
    .src(path.src.js) //Чи краще мініфікувати через path???
    .pipe(concat("main.js"))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}
function scriptsMin() {
  return gulp
    .src("dist/js/main.js")
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(path.build.js));
}
// function images() {
//   return (
//     gulp
//       .src(path.src.img) //"src/img/**/*.{jpg,jpeg,png,gif,webp,svg}"
//       // .pipe(imagemin())
//       .pipe(gulp.dest(path.build.img))
//     // .pipe(browserSync.stream());
//   );
// }
function fonts() {
  return gulp
    .src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(browserSync.stream());
}
function libs() {
  return gulp
    .src(path.src.libs)
    .pipe(gulp.dest(path.build.libs))
    .pipe(browserSync.stream());
}

function clean() {
  return deleteAsync(["./dist"]);
}
function server() {
  browserSync.init({
    server: {
      baseDir: ["./dist", "./src"],
    },
    notify: false,
    port: 3000,
  });
}

export function ttfToWoff() {
  return gulp
    .src(path.src.fonts, { encoding: false })
    .pipe(ttf2woff())
    .pipe(gulp.dest(path.build.fonts))
    .pipe(browserSync.stream());
}
// export function ttfToWoff2() {
//   return gulp
//     .src(path.src.fonts)
//     .pipe(ttf2woff2())
//     .pipe(gulp.dest(path.build.fonts))
//     .pipe(browserSync.stream());
// }
export function watchFiles() {
  gulp.watch(path.watch.pages, html);
  gulp.watch(path.watch.css, style);
  gulp.watch(path.watch.js, scripts);
  gulp.watch(path.watch.fonts, fonts);
  // gulp.watch(path.watch.img, images);
  gulp.watch(path.watch.libs, libs);
}

const fontTask = gulp.series(ttfToWoff);

const dev = gulp.series(
  clean,
  gulp.parallel(html, style, scripts, libs),
  fontTask,
  gulp.parallel(watchFiles, server),
);
const build = gulp.series(
  clean,
  gulp.parallel(html, libs, style, scripts),
  fontTask,
  gulp.parallel(scriptsMin, styleMin, server),
);

export default dev;
export { build, fontTask, clean };
