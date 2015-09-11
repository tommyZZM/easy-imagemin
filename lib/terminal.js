/**
 * Created by tommyZZM on 2015/9/11.
 */
var chalk = require("chalk");

exports.warn = function(){
    process.stdout.write(chalk["yellow"]["bold"]("[warning] "));
    console.log.apply(console, arguments);
};

exports.error = function(){
    process.stdout.write(chalk["red"]["bold"]("[error] "));
    console.log.apply(console, arguments);
};

exports.trace = function(){
    process.stdout.write(chalk["cyan"]["bold"]("[trace] "));
    console.log.apply(console, arguments);
};

exports.log = function(){
    process.stdout.write(chalk["green"]["bold"]("[trace] "));
    console.log.apply(console, arguments);
};