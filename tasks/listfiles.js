/**
 * grunt-listfiles
 * https://github.com/MoLow/grunt-listfiles-json
 *
 * Copyright (c) 2013 Larry Gordon
 * Licensed under the MIT License
 */

module.exports = function (grunt) {
  'use strict';

  function lineEnding(file, eol) {
    var linefeed = '\n';
    if (eol === 'cr') {
      linefeed = '\r';
    }
    else if (eol === 'crlf') {
      linefeed = '\r\n';
    }
    return file.replace(/\r\n|\n|\r/gi, linefeed);
  }

  // Create a list of files and perform an action on each file in the list then write the results to a file
  grunt.registerMultiTask('jsonlistfiles', 'Create a list of files and perform an action on each file in the list then write the results to a json file', function () {
    // Tell Grunt this task is asynchronous.
    var done = this.async();
    var list = [];
    var options = this.options({
      replacements: []
    });

    grunt.verbose.writeflags(options, 'Options');

    // Normalize the replacment patterns
    if (options.replacements.length > 0) {
      options.replacements = options.replacements.map(function (replacement) {
        return [replacement.pattern, replacement.replacement];
      });
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
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
      grunt.log.ok(totalFiles + ' file' + (totalFiles === 1 ? '' : 's') + ' processed.');
      grunt.log.ok('Created file ' + f.dest);
    });

    // Tell grunt the async task is complete
    done();
  });

};