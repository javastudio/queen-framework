'use strict';

var fs = require('fs')
, path = require('path')
, gulp = require('gulp')
, $ = require('gulp-load-plugins')()
, marked = require('jstransformer-marked')
, browserSync = require('browser-sync')
, transformer = require('jstransformer');


// Queen Header from package.json 
var pkg    = require('./package.json');
var banner = [
  '/*!',
  ' * Queen Project - <%= pkg.description %>',
  ' * ',
  ' * @version : v<%= pkg.version %>',
  ' * @link    : <%= pkg.homepage %>',
  ' * @license : <%= pkg.license %> License',
  ' * @author  : <%= pkg.author.name %> | (<%= pkg.author.url %>)',
  ' **/',
  ' ',
  ''].join('\n');

// Queen Framework
var app  = [];
app.dist = './app/dist';

var docs = [];
docs.assets = './docs/assets';

var siteServer = {
    host : 'http://0.0.0.0',
    port : 5000
};


/**
 * @app | Queen JS Task
 * ------------------------------------------------------------------------ */
app.js = {
    mapRoot: 'file:///home/excel/sandbox/lab/queen-framework/app/src/scripts',
    src  : './app/src/scripts/**/*.js',
    dest : app.dist + '/js'
};

gulp.task('js:app', function() {
// Uncompressed | concating file
    gulp.src(app.js.src)
        .pipe($.sourcemaps.init())
        .pipe($.plumber({errorHandler: $.notify.onError("Error :: <%= error.message %>")}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.concat('queen.js')) // <- Concating
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe($.sourcemaps.write('.', { sourceRoot: app.js.mapRoot, includeContent: false }))
        .pipe(gulp.dest(app.js.dest));

// Compressed | concating file
    return gulp.src(app.js.src)
        .pipe($.sourcemaps.init())
        .pipe($.plumber({errorHandler: $.notify.onError("Error :: <%= error.message %>")}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.uglify()) // <- Compressed
        .pipe($.concat('queen.min.js')) // <- Concating
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe($.sourcemaps.write('.', { sourceRoot: app.js.mapRoot, includeContent: false }))
        .pipe(gulp.dest(app.js.dest));
});

/**
 * @app | Queen SASS Task
 * ------------------------------------------------------------------------ */
app.sass = {
    mapRoot: 'file:///home/excel/sandbox/lab/queen-framework/app/src/stylesheets',
    src  : './app/src/stylesheets/**/*.scss',
    dest : app.dist + '/css'
};
gulp.task('sass:app', function() {
// App Quenn | Uncompressed
    gulp.src(app.sass.src)
        .pipe($.scssLint({'config': '.scsslintrc'}))
        .pipe($.sourcemaps.init())
        .pipe($.plumber({errorHandler: $.notify.onError("Error :: <%= error.message %>")}))
        .pipe($.sass({ outputStyle  : 'expanded' }))
        .pipe($.autoprefixer({ browsers: ['last 15 versions'], cascade: false }))
        .pipe($.stripCssComments({preserve: false}))
        .pipe($.concat('queen.css'))
        .pipe($.removeEmptyLines())
        .pipe($.header('@charset "UTF-8";\n' + banner, { pkg : pkg } ))
        .pipe($.sourcemaps.write('.', { sourceRoot: app.sass.mapRoot, includeContent: false }))
        .pipe(gulp.dest(app.sass.dest));

// App Quenn | Compressed (minify)
    return gulp.src(app.sass.src)
        .pipe($.scssLint({'config': '.scsslintrc'}))
        .pipe($.sourcemaps.init())
        .pipe($.plumber({errorHandler: $.notify.onError("Error :: <%= error.message %>")}))
        .pipe($.sass({ outputStyle  : 'compressed' }))
        .pipe($.autoprefixer({ browsers: ['last 15 versions'], cascade: false }))
        .pipe($.stripCssComments({preserve: false}))
        .pipe($.concat('queen.min.css'))
        // .pipe($.cleanCSS({debug: true}, function(details) {
        //     console.log(details.name + ': ' + details.stats.originalSize);
        //     console.log(details.name + ': ' + details.stats.minifiedSize);
        // }))
        .pipe($.removeEmptyLines())
        .pipe($.header('@charset "UTF-8";\n' + banner, { pkg : pkg } ))
        .pipe($.sourcemaps.write('.', { sourceRoot: app.sass.mapRoot, includeContent: false }))
        .pipe(gulp.dest(app.sass.dest));
});


/**
 * @view | docs | site
 * JS Task
 * ------------------------------------------------------------------------ */
docs.js = {
    mapRoot: 'file:///home/excel/sandbox/lab/queen-framework/app/views/assets/js',
    src  : './app/views/assets/js/**/*.js',
    dest : docs.assets + '/js'
};
gulp.task('js:docs', function() {
    // concat, compressed
    return gulp.src(docs.js.src)
        .pipe($.sourcemaps.init())
        .pipe($.plumber({errorHandler: $.notify.onError("Error :: <%= error.message %>")}))
        // .pipe($.jshint())
        // .pipe($.jshint.reporter('default'))
        .pipe($.uglify()) // <- Compressed
        .pipe($.concat('docs.js')) // <- Concating
        .pipe($.sourcemaps.write('.', { sourceRoot: docs.js.mapRoot, includeContent: false }))
        .pipe(gulp.dest(docs.js.dest));
});


/**
 * @view | docs | Site
 * SASS Task
 * ------------------------------------------------------------------------ */
docs.sass = {
    mapRoot: 'file:///home/excel/sandbox/lab/queen-framework/app/views/assets/css',
    src  : './app/views/assets/css/**/*.scss',
    dest : docs.assets + '/css'
};
gulp.task('sass:docs', function() {
    // build docs view css -> _site view css
    return gulp.src([docs.sass.src])
        // .pipe($.scssLint({'config': '.scsslintrc'}))
        .pipe($.sourcemaps.init())
        .pipe($.plumber({errorHandler: $.notify.onError("Error :: <%= error.message %>")}))
        .pipe($.sass({ outputStyle  : 'expanded', includePaths: [ './app/src/stylesheets' ] }))
        // .pipe($.autoprefixer({ browsers: ['last 15 versions'], cascade: false }))
        .pipe($.stripCssComments({preserve: false}))
        .pipe($.concat('docs.css'))
        .pipe($.removeEmptyLines())
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe($.sourcemaps.write('.', { sourceRoot: docs.sass.mapRoot, includeContent: false }))
        .pipe(gulp.dest(docs.sass.dest));
});

/**
 * @view | docs | Site
 * Image Task
 * ------------------------------------------------------------------------ */
docs.img = {
    src  : './app/views/assets/img/**',
    dest : docs.assets + '/img'
};
gulp.task('img:docs', function() {   
    return gulp.src(docs.img.src)
        .pipe(gulp.dest(docs.img.dest));
});


/**
 * @view | docs | site
 * Jade Task - HTML
 * ------------------------------------------------------------------------ */
docs.html = {
    src  : './app/views/**/*.jade',
    dest : './docs'
};
gulp.task('html:docs', function() {
    return gulp.src([docs.html.src, '!./app/views/_*/**/*.jade'])
        .pipe($.jade({ pretty: true }))
        .pipe($.data(function (file) {
                // return JSON.parse(fs.readFileSync('./docs/data/main.json'));
                return {
                    baseUrl: siteServer.host + ':' + siteServer.port,
                    siteTitle: ' | Queen CSS Framework'
                };
            }))
        .pipe($.template())
        // .pipe($.removeEmptyLines())
        .pipe(gulp.dest(docs.html.dest));
});

/**
 * @lint | CSS Linter
 * ------------------------------------------------------------------------ */
var lintCssReporter = function(file) {
    $.util.log($.util.colors.cyan(file.csslint.errorCount)+' errors in '+$.util.colors.magenta(file.path));

    file.csslint.results.forEach(function(result) {
        $.util.log(result.error.message+' on line '+result.error.line);
    });
};

gulp.task('lint:css', function() {
    return gulp.src([
              app.sass.dest + '/**/*.css'
            // , docs.sass.dest + '/**/*.css'
        ])
        .pipe($.csslint('.csslintrc'))
        .pipe($.csslint.reporter(lintCssReporter));
});

/**
 * @lint html
 * ------------------------------------------------------------------------ */
gulp.task('lint:html', function() {
    return gulp.src(docs.html.dest + '/**/*.html')
        .pipe($.htmlhint('.htmlhintrc'))
        .pipe($.htmlhint.reporter());
});


/**
 * @hard-reset
 * ------------------------------------------------------------------------ */
gulp.task('hard-reset', function() {
    return gulp.src([
              '.sass-cache'
            , '.tmp'
            , './_gh*'
            , './docs/*'
            , './app/dist/*'
        ], {read: false})
        .pipe($.clean({force: true}));
});

/**
 * @soft-reset
 * ------------------------------------------------------------------------ */
gulp.task('soft-reset', function() {
    return gulp.src([
              '.sass-cache'
            , '.tmp'
        ], {read: false})
        .pipe($.clean({force: true}));
});


/**
 * @build | App Framework
 * ------------------------------------------------------------------------ */
gulp.task('build:js', function(cb) { $.sequence(
      'js:app'
    , 'js:docs'
    , cb
)});
gulp.task('build:sass', function(cb) { $.sequence(
      'sass:app'
    , 'sass:docs'
    , 'lint:css'
    , cb
)});

gulp.task('build:framework', function(cb) { $.sequence(
      'hard-reset'
    , 'build:js'
    , 'build:sass'
    , cb
)});

/*
 * @build | docs app
 * ------------------------------------------------------------------------ */
gulp.task('build:views', function(cb) { $.sequence(
      'html:docs'
    , 'img:docs'
    , 'lint:html'
    , cb
)});

/**
 * @copy | App dist -> _site assets
 * ------------------------------------------------------------------------ */
gulp.task('copy:dist', function() {
    // 1. copy from app dist -> docs assets
    gulp.src(app.dist+'/**').pipe(gulp.dest(docs.assets));
});

/**
 * @serve ['development']
 * ------------------------------------------------------------------------ */
gulp.task('development', $.sequence(
      'build:framework'   // build css framework
    , 'build:views'       // build views
    , 'copy:dist'         // copy ./app/dist -> ./docs/assets/dist
    , 'sync'
    , 'watch'
));

/**
 * @release ['production']
 * ------------------------------------------------------------------------ */
gulp.task('production', $.sequence(
      'build:framework'   // build app css framework
    , 'copy:dist'         // copy ./app/dist -> ./docs/assets/dist
));


/**
 * @watch
 * Watching Task
 * ------------------------------------------------------------------------ */
gulp.task('watch', function() {
    gulp.watch([app.js.src, docs.js.src],     ['build:js']);   // watch and build app:js -> app/dist/js
    gulp.watch([app.sass.src, docs.sass.src], ['build:sass']); // watch and build app:sass -> app/dist/css
    gulp.watch(app.dist+'/**', ['copy:dist']);                 // watch and copy app/dist -> docs/assets/*
    gulp.watch(docs.html.src,  ['build:views']);               // watch and build app/views/*.jade -> docs/*.html

    gulp.watch('./docs/**/*').on('change', function() {
        browserSync.reload();
    });
});


/**
 * @browserSync | Connect Server
 * ------------------------------------------------------------------------ */
gulp.task('sync', function() {
    browserSync({
        port   : siteServer.port,
        server : './docs',
        // proxy: siteServer.host + ':' + siteServer.port,

        reloadOnRestart: true,
        open: false,
        online: false,
        notify: false,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        }
    });
});

/**
 * @ Default Task
 * ------------------------------------------------------------------------ */
gulp.task('default', $.sequence('sync', 'watch'));
