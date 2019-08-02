var thinkjs = require('thinkjs');
var path = require('path');

require('babel-polyfill');

var rootPath = path.dirname(__dirname);
var VIEW_PATH = rootPath + '/view';

global.midwayConf = require(rootPath + '/midway.json').configurations;

// 清理编译目录
var fs = require('fs-promise');
fs.removeSync(rootPath + '/www/static/build/');

// antd 开启 style 后，node 端运行需另起进程
var child_process = require('child_process');
var c = child_process.exec('npm run webpack -- --watch --color');
c.stdout.pipe(process.stdout);
c.stderr.pipe(process.stderr);
// c.stdout.setEncoding('utf-8');
// c.stderr.setEncoding('utf-8');
// c.stdout.on('data', console.log)
// c.stderr.on('data', console.log)

require("babel-register")({
	only: VIEW_PATH,
});

var instance = new thinkjs({
	APP_PATH: rootPath + path.sep + 'app',
	RUNTIME_PATH: rootPath + path.sep + 'runtime',
	ROOT_PATH: rootPath,
	RESOURCE_PATH: __dirname,
	env: 'development'
});

//compile src/ to app/
instance.compile({
	log: true,
	presets: [],
	plugins: []
});


// 监听view变化
var viewReloadInstance = instance.getReloadInstance(VIEW_PATH);
viewReloadInstance.run();

instance.run();