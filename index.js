/**
 * Created by tommyZZM on 2015/9/11.
 */
var fs = require('fs');
var path = require("path");
var stream = require('stream');

var green = require("green");
var args = green.args;

var gulp = require("gulp");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var cwd_path = process.cwd();
var out_path = null;
var terminal = require("./lib/terminal.js");
var min_quality = "0-20";

var help = function(){
    terminal.trace("欢迎使用 easy-imagemin 命令行工具,用法 -t:<目录> -o:<输出目录>");
    terminal.trace("welcome use easy-imagemin cli tool,useage -t:<path> -o:<outpath>");
    terminal.trace("source code : github.com/tommyZZM/easy-imagemin");
};

var task = function(taskPath){

    var _task_path = [".png",".jpg"].map(function(type){
        return path.join(taskPath,"/**/*"+type);
    });

    return function(){
        gulp.src(_task_path,{base:cwd_path})
            .pipe(imagemin({
                progressive: true,
                optimizationLevel:7,
                svgoPlugins: [{removeViewBox: false,removeEmptyAttrs: true}],
                use: [pngquant({quality:min_quality})]
            }))
            .pipe((function(){

                var fileStream = new stream.Transform({objectMode: true});
                fileStream._transform = function(file, unused, callback){

                    //console.log(file.path.indexOf(taskPath)>=0,taskPath,file.path);

                    file.path = file.path.replace(taskPath,out_path||taskPath+".out");

                    callback(null, file);
                };

                return fileStream;
            })())
            .pipe(gulp.dest(cwd_path))
    }
};

var isdev = false;
var run = function(){
    if(fs.existsSync("./package.json")){
        var packagejson = require("./package.json");
        if(packagejson.name === "easy-imagemin"){
            isdev = true;
        }
    }

    if(!args["t"] && !args["target"]){
        help();
        return;
    }

    min_quality = args["q"]||args["quality"]||min_quality;
    var _targetpath = args["t"]||args["target"];
    var _outpath = args["o"]||args["out"];
    if(!_targetpath || _targetpath.indexOf("../")>0 || _targetpath==="./"){
        terminal.error("target:",_targetpath,"formart error!");
        return;
    }

    var full_path  = path.join(cwd_path,_targetpath);
    if(_outpath){
        var full_out_path = path.join(cwd_path,_outpath)
    }
    if(!fs.existsSync(full_path)){
        terminal.error(full_path,"not exists!");
        return;
    }

    if(fs.existsSync(full_out_path) && !args["f"]){
        terminal.warn("out path",_outpath,"already exists! use -f to force output here");
    }else{
        out_path = full_out_path;
    }

    gulp.task("default",task(full_path));
    terminal.log("minifying all images in",_targetpath,"quality:",min_quality);
    gulp.start("default");
};

//run();

exports.run = run;