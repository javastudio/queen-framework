var gulp = require('gulp');
var Elixir = require('laravel-elixir');
var $ = require('gulp-load-plugins')();

var config = Elixir.config;

Elixir.extend('lintCss', function(lint) {

    var lintCssReporter = function(file) {
        $.util.log($.util.colors.cyan(file.csslint.errorCount)+' errors in '+$.util.colors.magenta(file.path));

        file.csslint.results.forEach(function(result) {
            $.util.log(result.error.message+' on line '+result.error.line);
        });
    };

    var reporter = (lint.reporter) ? lint.reporter : lintCssReporter;

    new Elixir.Task('lintCss', function() {
        return gulp.src(lint.source)
            .pipe($.csslint(lint.rcFile))
            .pipe($.csslint.reporter(reporter));
    });

});

