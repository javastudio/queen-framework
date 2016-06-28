var Elixir = require('laravel-elixir');
var config = Elixir.config;
var pkg = require('./package.json');

require('require-dir')('./tasks');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

Elixir(function(app) {

    /**
     * Clean Directorie
     */
    app.clean();

    /**
     * Font Application
     */
    app.copy('./node_modules/font-awesome/fonts', './public/assets/fonts');
    app.copy(config.docAssetsPath+'/images', './public/assets/img');

    /**
     * Docs Stylesheet Application
     */
    app.sass(config.docAssetsPath+'/stylesheets/app.scss', './public/assets/css/app.css');

    /**
     * Javascript Application
     */
    app.browserify('queen.js', './public/assets/js/queen.js');
    app.scriptsIn(config.docAssetsPath+'/scripts', './public/assets/js/app.js');

    /**
     * Docs HTML Application
     */
    app.jade({
        config: {
            pretty: true,
            locals: {
                title: "Queen CSS Framework",
                baseUrl: config.server.host
            }
        }
    });

    /**
     * CSS Lint
     */
    app.lintCss({
        source: [
            config.publicPath + "/**/*.css"
        ],
        rcFile: ".csslintrc"
    });

    /**
     * CSS Lint
     */
    app.htmlHint({
        source: [
            "./public/**/*.html"
        ],
        rcFile: ".htmlhintrc"
    });

    /**
     * BrowserSync
     */
    app.browserSync({
        server: config.server.baseDir,
        proxy: config.server.proxy,
        notify: false
    });

});
