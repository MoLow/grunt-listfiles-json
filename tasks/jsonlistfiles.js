module.exports = function (grunt) {
    'use strict';
    
    var path = require('path');
    
    // Create a list of files and perform an action on each file in the list then write the results to a file
    grunt.registerMultiTask('jsonlistfiles', 'Create a list of files and perform an action on each file in the list then write the results to a json file', function () {
        // Tell Grunt this task is asynchronous.
        var done = this.async();
        var variables = {}, variablesIndexes = {};
        var options = this.options({
            cwd: ""
        });
        var data = this.data;
        
        
        function cartesianProduct(input, current) {
            if (!input || !input.length) { return []; }
            
            var head = input[0];
            var tail = input.slice(1);
            var output = [];
            
            for (var key in head) {
                for (var i = 0; i < head[key].length; i++) {
                    var newCurrent = copy(current);
                    newCurrent[key] = head[key][i];
                    if (tail.length) {
                        var productOfTail = cartesianProduct(tail, newCurrent);
                        output = output.concat(productOfTail);
                    } else output.push(newCurrent);
                }
            }
            return output;
        }
        
        function copy(obj) {
            var res = {};
            for (var p in obj) res[p] = obj[p];
            return res;
        }
        
        grunt.template.addDelimiters('myNewDelimiters', '{%', '%}');
        
        function formatString(str, indexes) {
            var IFSTART = '[?', IFEND = ']', NEGATESTART = '[!', NEGATEEND = ']';
            
            if ((str.indexOf("{%") > -1) && (str.indexOf("%}") > -1)) {
                if (str.indexOf(IFSTART) > -1) {
                    
                    var expr = str.substring(str.indexOf(IFSTART) + IFSTART.length, str.indexOf(IFEND, str.indexOf(IFSTART)));
                    expr = expr.split("==");
                    var values = [];
                    
                    for (var i in expr) {
                        var nstr = expr[i];
                        if ((indexes !== undefined && indexes !== null)) {
                            for (var index in indexes) {
                                var nstr = nstr.replace('#' + index, index + '[' + indexes[index] + ']');
                            }
                        }
                        values.push(expr[i] === nstr ? nstr : grunt.template.process(nstr, { delimiters: 'myNewDelimiters', data: variables }));
                    }
                    
                    var status = true;
                    for (var i in values) {
                        status = status && (i == 0 || values[i - 1] === values[i]);
                    }
                    
                    if (status) return str.replace(IFSTART + expr.join('==') + IFEND, '');
                    
                    return [];


                }
                else if (indexes !== undefined && indexes !== null) {
                    var nstr = str;
                    for (var index in indexes) {
                        var nstr = nstr.replace('#' + index, index + '[' + indexes[index] + ']');
                    }
                    if (nstr !== str) return grunt.template.process(nstr, { delimiters: 'myNewDelimiters', data: variables });
                }
                
                var keys = [];
                for (var _var in variables) {
                    if (str.indexOf(_var) > -1) {
                        var nobj = {};
                        nobj[_var] = [];
                        for (var index in variables[_var])
                            nobj[_var].push(index);
                        keys.push(nobj);
                    }
                }
                
                keys = cartesianProduct(keys);
                
                var arr = [];
                for (var key in keys) {
                    var nstr = str;
                    for (var _var in keys[key]) {
                        nstr = nstr.replace(_var, _var + '[' + keys[key][_var] + ']');
                    }
                    
                    if (nstr !== str) {
                        arr.push({ indexes: keys[key], value: grunt.template.process(nstr, { delimiters: 'myNewDelimiters', data: variables }) })
                    }
                }
                
                return arr;
            }
            
            var addSlash = false;
            if (str.indexOf(NEGATESTART) > -1) {
                var expr = str.substring(str.indexOf(NEGATESTART) + NEGATESTART.length, str.indexOf(NEGATEEND, str.indexOf(NEGATESTART)));
                var strCopy = str.replace(NEGATESTART + expr + NEGATEEND, '');
                strCopy = (addSlash = (strCopy.charAt(0) === '/')) ? strCopy.substring(1) : strCopy;
                expr = expr.charAt(0) === '/' ? expr.substring(1) : expr;
                strCopy = [strCopy, '!' + expr];
            } else {
                var strCopy = (addSlash = (str.charAt(0) === '/')) ? str.substring(1) : str;
            }
            
            var files = grunt.file.expand({ cwd: options.cwd }, strCopy);
            if (files.length > 0) {
                files.forEach(function (file, i, arr) {
                    arr[i] = (addSlash?'/':'') + file;
                })
                return files.length > 1 ? files : files[0];
            }
            return str;
        }
        
        function merge(obj, key, data, odata) {
            if ((grunt.util.kindOf(odata) !== grunt.util.kindOf(data)) && (grunt.util.kindOf(data) === "object" || grunt.util.kindOf(data) === "array")) {
                if (grunt.util.kindOf(obj) == "array") {
                    for (var i in data) {
                        if (obj.indexOf(data[i]) === -1) {
                            obj.push(data[i]);
                        }
                    }
                } else if (grunt.util.kindOf(obj) == "object") {
                    for (var i in data) {
                        obj[i] = data[i];
                    }
                }
            } else if ((grunt.util.kindOf(obj) !== grunt.util.kindOf(data)) && (grunt.util.kindOf(obj) == "array") && (grunt.util.kindOf(data) === "string")) {
                obj.push(data);
            } else {
                obj[key] = data;
            }
        }
        
        function recursiveSearch(data) {
            if (grunt.util.kindOf(data) === "object" || grunt.util.kindOf(data) === "array") {
                var obj = grunt.util.kindOf(data) === "array" ? [] : {};
                for (var key in data) {
                    var nkeys = formatString(key, variablesIndexes);
                    if (grunt.util.kindOf(nkeys) === "array") {
                        for (var nkey in nkeys) {
                            for (var nindex in nkeys[nkey].indexes)
                                variablesIndexes[nindex] = nkeys[nkey].indexes[nindex];
                            
                            merge(obj, nkeys[nkey].value, recursiveSearch(data[key]), data[key]);
                        }
                    } else {
                        merge(obj, nkeys, recursiveSearch(data[key]), data[key]);
                    }
                }
                return obj;
            }
            else if (grunt.util.kindOf(data) === "string") {
                return formatString(data, variablesIndexes);
            }
            else {
                return data;
            }
        }
        
        function getVariables() {
            for (var _var in data.variables) {
                var __var = grunt.file.expand({ cwd: options.cwd }, data.variables[_var]);
                if (__var.length) {
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
                } else {
                    variables[_var] = data.variables[_var];
                }
            };
        }
        
        getVariables();
        
        for (var dest in data.files) {
            grunt.file.write(dest, JSON.stringify(recursiveSearch(data.files[dest]), null, 4));
            grunt.log.ok('Created file ' + dest);
        };
        
        
        // Tell grunt the async task is complete
        done();
    });

};
