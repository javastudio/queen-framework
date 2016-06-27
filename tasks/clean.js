var gulp = require('gulp');
var Elixir = require('laravel-elixir');
var $ = require('gulp-load-plugins')();

var config = Elixir.config;

Elixir.extend('clean', function(clean) {

    var source = (clean) ? clean.source : config.clean.sourceFolder;
    var pluginOptions = (clean) ? clean.options : config.clean.pluginOptions;
    var readFile = (clean) ? clean.read : config.clean.read;

    new Elixir.Task('clean', function() {
        return gulp.src(source, {read: readFile})
            .pipe($.clean(pluginOptions));
    });

});
