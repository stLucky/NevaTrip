const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const uglify = require("gulp-uglify-es").default;
const htmlmin = require('gulp-htmlmin');
const csso = require('postcss-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const del = require('del');
const gulpif = require("gulp-if");
const sync = require('browser-sync').create();

const isProd = process.argv.includes("build");

// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Styles',
          sound: false,
          message: err.message
        };
      })
    }))
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
};

exports.styles = styles;


// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
};

// Scripts
const scripts = () => {
  return gulp.src('source/js/main.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};

exports.scripts = scripts;

// Images

const images = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(gulpif(isProd, imagemin([
      imagemin.mozjpeg({quality: 85, progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ])))
    .pipe(gulp.dest('build/img'));
};

exports.images = images;

// Webp

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(webp({quality: 85}))
    .pipe(gulp.dest('build/img'));
};

exports.createWebp = createWebp;


// Copy

const copy = () => {
  return gulp.src([
      'source/fonts/*.{woff2,woff}',
      'source/*.ico',
    ],
    {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
};

exports.copy = copy;

//CopyImg

const copyImg = () => {
  return gulp
    .src('source/img/*.{jpg,png,svg}')
    .pipe(gulp.dest('build/img'));
};

exports.copyImg = copyImg;

// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload

const reload = done => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/img/*.{jpg,png,svg}', gulp.series(copyImg, reload));
};

// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    copy,
    images,
    createWebp
  )
);

exports.build = build;

exports.default = gulp.series(
  build,
  server,
  watcher
);
