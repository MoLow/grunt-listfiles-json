/**
 * grunt-listfiles
 * https://github.com/psyrendust/grunt-listfiles
 *
 * Copyright (c) 2013 Larry Gordon
 * Licensed under the MIT License
 */

module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        clean: {
            test: ['tmp']
        },
        // Configuration to be run (and then tested).
        jsonlistfiles: {
            test1: {
                variables: {
                    '$css': 'test/fixtures/inner/*.css',
                    '$js': 'test/fixtures/inner/*.js'
                },
                files: {
                    'tmp/output.json': {
                        editor: {
                            css: {
                                '{%= $css.filename %}': [
                                    '{%= #$css.path %}',
                                    'test/fixtures/*.css',
                                    'exclude2.scss'
                                ]
                            },
                            js: {
                                '{%= $js.filename %}': [
                                   '{%= #$js.path %}',
                                   'test/fixtures/*.js'
                                ]

                            }
                        }
                    }
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });
    // Load this plugin's task(s).
    grunt.loadTasks('tasks');

    // searchText.replace(/(:dont_touch =>\[\n)([\s\S]*?)(\t+?\])/gi, "$1$3")

    // Whenever the 'test' task is run, first clean the 'tmp' dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'jsonlistfiles', 'nodeunit', 'clean']);

    // For development
    grunt.registerTask('dev', ['clean', 'jsonlistfiles']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jsonlistfiles', 'nodeunit', 'clean']);

};
