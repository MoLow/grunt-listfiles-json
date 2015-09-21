# grunt-listfiles [![NPM version](https://badge.fury.io/js/grunt-listfiles.png)](http://badge.fury.io/js/grunt-listfiles) [![Build Status](https://travis-ci.org/psyrendust/grunt-listfiles.png?branch=master)](https://travis-ci.org/psyrendust/grunt-listfiles)

> Create a list of files and perform an action on each file in the list then write the results to a file.


## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-listfiles --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-listfiles');
```

*This plugin was designed to work with Grunt 0.4.x.*


## Listfiles task
_Run this task with the `grunt listfiles` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options


#### replacements
Type: `Array`  
Default: `[]`

This option will hold all your pattern/replacement pairs. A pattern/replacement pair should contain key:value pairs containing:

* pattern `String` or `Regex`
* replacement `String` or `Function`

```javascript
options: {
  replacements: [{
    pattern: /\/(asdf|qwer)\//ig,
    replacement: '"$1"'
  }, {
    pattern: ',',
    replacement: ';'
  }, {
    pattern: /(file)(_)([\S]*?)(_)(test)/gi,
    replacement: function (match, p1, p2, p3, p4, p5, offset, string) {
      return [p1, p3, p5].join('-');
    }
  }]
}
```

###### Note

If specifying a function as a parameter for the replacemnt please see the documentation at [https://developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) for more details.
If the pattern is a string, only the first occurrence will be replaced, as stated on [String.prototype.replace](http://www.ecma-international.org/ecma-262/5.1/#sec-15.5.4.11).

### Usage Examples

#### Example Config

```javascript
grunt.initConfig({
  listfiles: {
    test1: {
      files: {
        'tmp/output.txt': [
          'test/fixtures/**/*.*',
          '!test/fixtures/{,*/,**/}*.{scss,html,md,rb}',
          '!test/fixtures/{,*/,**/}LICENSE'
        ]
      }
    }
  }
});

grunt.loadNpmTasks('grunt-listfiles-json');

grunt.registerTask('default', ['jsonlistfiles']);
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2013-09-16   v0.1.4   Added regular expression replacemnt option.
 * 2013-07-02   v0.1.3   Added Version Badge.
 * 2013-07-02   v0.1.2   Fixed broken Travis test.
 * 2013-07-02   v0.1.1   Added async done(). Added grunt-bump. Fixed line ending bug.
 * 2013-06-28   v0.1.0   Initial release.
