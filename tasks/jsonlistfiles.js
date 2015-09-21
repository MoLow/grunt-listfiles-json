/**
 * grunt-listfiles
 * https://github.com/MoLow/grunt-listfiles-json
 *
 * Copyright (c) 2013 Larry Gordon
 * Licensed under the MIT License
 */

module.exports = function (grunt) {
    'use strict';

    var path = require('path');


    // Create a list of files and perform an action on each file in the list then write the results to a file
    grunt.registerMultiTask('jsonlistfiles', 'Create a list of files and perform an action on each file in the list then write the results to a json file', function () {
        // Tell Grunt this task is asynchronous.
        var done = this.async();
        var variables = {};
        var data = this.data;


        for (var _var in data.variables) {
            var __var = grunt.file.expand(data.variables[_var]);
            __var.forEach(function (file) {
                var ext = path.extname(file);
                var filename = path.basename(file, ext);
                variables[_var] = variables[_var] || [];
                variables[_var].push({
                    path: file,
                    filename: filename,
                    ext: ext
                });
            })
        };

        grunt.template.addDelimiters('myNewDelimiters', '{%', '%}');

        function formatString(str, index) {
            if ((str.indexOf("{%") === 0) && (str.indexOf("%}", str.length - "%}".length) !== -1)) {
                var arr = [];
                for (var _var in variables) {
                    if (index !== undefined && index !== null) {
                        var nstr = str.replace('#' + _var, _var + '[' + index + ']');
                        if (nstr !== str) return grunt.template.process(nstr, { delimiters: 'myNewDelimiters', data: variables });
                    }

                    for (var i in variables[_var]) {
                        var nstr = str.replace(_var, _var + '[' + i + ']');
                        if (nstr !== str) {
                            arr.push(grunt.template.process(nstr, { delimiters: 'myNewDelimiters', data: variables }))
                        }
                    }
                }

                return arr;
            }

            var files = grunt.file.expand(str);
            if (files.length > 0) {
                return files;
            }
            return str;
        }

        function merge(obj, key, data, odata) {
            if ((grunt.util.kindOf(odata) !== grunt.util.kindOf(data)) && (grunt.util.kindOf(data) === "object" || grunt.util.kindOf(data) === "array")) {
                if (grunt.util.kindOf(obj) == "array") {
                    for (var i in data) {
                        obj.push(data[i]);
                    }
                } else if (grunt.util.kindOf(obj) == "object") {
                    for (var i in data) {
                        obj[i] = data[i];
                    }
                }
            } else {
                obj[key] = data;
            }
        }

        function recursiveSearch(data, stringIndex) {
            if (grunt.util.kindOf(data) === "object" || grunt.util.kindOf(data) === "array") {
                var obj = grunt.util.kindOf(data) === "array" ? [] : {};
                for (var key in data) {
                    var nkeys = formatString(key, stringIndex);
                    if (grunt.util.kindOf(nkeys) === "array") {
                        for (var nkey in nkeys) {
                            merge(obj, nkeys[nkey], recursiveSearch(data[key], nkey), data[key]);
                        }
                    } else {
                        merge(obj, key, recursiveSearch(data[key], stringIndex), data[key]);
                    }
                }
                return obj;
            }
            else if (grunt.util.kindOf(data) === "string") {
                return formatString(data, stringIndex);
            }
            else {
                return data;
            }
        }


        for (var dest in data.files) {
            var file = data.files[dest];
            var output = JSON.stringify(recursiveSearch(file), null, 4);
            grunt.file.write(dest, output);
            grunt.log.ok('Created file ' + dest);
        };


        // Iterate over all specified file groups.
        /* this.files.forEach(function(f) {
           // Concat specified files.
           var src = f.src.filter(function(filepath) {
             // Warn on and remove invalid source files (if nonull was set).
             if (!grunt.file.exists(filepath)) {
               grunt.log.warn('Source file "' + filepath + '" not found.');
               return false;
             } else {
               return true;
             }
           });
     
           // Add prefix and postfix to each line
           var totalFiles = src.length,
               last = totalFiles - 1,
               output = '';
           // Perform replacements
           if (options.replacements.length > 0) {
             src = src.map(function (filePath) {
               return options.replacements.reduce(function (filePath, replacement) {
                 return filePath.replace(replacement[0], replacement[1]);
               }, filePath);
             });
           }
           output = JSON.stringify(src)
           grunt.file.write(f.dest, output);
      
        // grunt.log.ok(totalFiles + ' file' + (totalFiles === 1 ? '' : 's') + ' processed.');
        // grunt.log.ok('Created file ' + f.dest);
    });
           */

        // Tell grunt the async task is complete
        done();
    });

};