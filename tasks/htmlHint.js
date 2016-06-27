var gulp = require('gulp');
var Elixir = require('laravel-elixir');
var $ = require('gulp-load-plugins')();

var config = Elixir.config;

Elixir.extend('htmlHint', function(html) {

    var reporter = (html.reporter) ? html.reporter : null;

    new Elixir.Task('htmlHint', function() {
        return gulp.src(html.source)
            .pipe($.htmlhint(html.rcFile))
            .pipe($.htmlhint.reporter(reporter));
    });

});
