/*jshint globalstrict: true*/
'use strict';

var grunt = require('grunt');


exports.test = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  test1: function (test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/output.json');
    var expected = grunt.file.read('test/expected/expected.json');
    test.equal(String(actual), String(expected), 'output.txt should match expected.txt');
    test.done();
  }
};
