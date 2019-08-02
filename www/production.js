var thinkjs = require('thinkjs');
var path = require('path');

require('babel-polyfill');

var rootPath = path.dirname(__dirname);

global.midwayConf = require(rootPath + '/midway.json').configurations;

var instance = new thinkjs({
  APP_PATH: rootPath + path.sep + 'app',
  RUNTIME_PATH: rootPath + path.sep + 'runtime',
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  env: 'production'
});

//preload packages before start server.
instance.run(true);