# grunt-listfiles-json [![NPM version](https://badge.fury.io/js/grunt-listfiles.png)](http://badge.fury.io/js/grunt-listfiles) [![Build Status](https://travis-ci.org/psyrendust/grunt-listfiles.png?branch=master)](https://travis-ci.org/psyrendust/grunt-listfiles)

> Create a list of files and perform an action on each file in the list then write the results to a file.


## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-listfiles-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-listfiles-json');
```

*This plugin was designed to work with Grunt 0.4.x.*


## JsonListfiles task
_Run this task with the `grunt jsonlistfiles` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Usage Examples

#### Example Config

```javascript
grunt.initConfig({
  jsonlistfiles: {
    test1: {
        variables: {
            '$theme': 'test/fixtures/inner/*.css',
            '$lang': 'test/fixtures/inner/*.js'
        },
        dest: {
            'tmp/output.json': {
                editor: {
                    css: {
                        '{%= $theme.filename %}': [
                            '{%= #$theme.path %}',
                            'test/fixtures/*.css',
                            'exclude2.scss'
                        ]
                    },
                    js: {
                        '{%= $lang.filename %}': [
                           '{%= #$lang.path %}',
                           'test/fixtures/*.js'
                        ]

                    }
                }
            }
        }
    }
  }
});

grunt.loadNpmTasks('grunt-listfiles-json');

grunt.registerTask('default', ['jsonlistfiles']);
```

result of that is:

```javascript
    {
        "editor": {
            "css": {
                "theme1": [
                    "test/fixtures/inner/theme1.css",
                    "test/fixtures/file1.css",
                    "exclude2.scss",
                    "test/fixtures/file3.css"
                ],
                "theme2": [
                    "test/fixtures/inner/theme2.css",
                    "test/fixtures/file1.css",
                    "exclude2.scss",
                    "test/fixtures/file3.css"
                ]
            },
            "js": {
                "ar": [
                    "test/fixtures/inner/ar.js",
                    "test/fixtures/file4.js",
                    "test/fixtures/file5.js",
                    "test/fixtures/file6.js",
                    "test/fixtures/file7.min.js",
                    "test/fixtures/file8.Min.js",
                    "test/fixtures/file_function_test.js"
                ],
                "he": [
                    "test/fixtures/inner/he.js",
                    "test/fixtures/file4.js",
                    "test/fixtures/file5.js",
                    "test/fixtures/file6.js",
                    "test/fixtures/file7.min.js",
                    "test/fixtures/file8.Min.js",
                    "test/fixtures/file_function_test.js"
                ]
            }
        }
    }
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2015-09-23   v0.1.5   Make export as Json, and use variables to format it.
 * 2013-09-16   v0.1.4   Added regular expression replacemnt option.
 * 2013-07-02   v0.1.3   Added Version Badge.
 * 2013-07-02   v0.1.2   Fixed broken Travis test.
 * 2013-07-02   v0.1.1   Added async done(). Added grunt-bump. Fixed line ending bug.
 * 2013-06-28   v0.1.0   Initial release.
