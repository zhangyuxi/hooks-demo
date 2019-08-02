// webpack 和 webpack-alias 都会引用该文件

const path = require('path');
const webpack = require('webpack');
const extend = require('extend');
const base = require('./webpack.config.babel.js');
const midwayConf = require('./midway.json').configurations;

const config = extend(true, {}, base);

function replaceRules(rules) {
	rules.forEach((rule) => {
		const index = config.module.rules.findIndex(orgRule => orgRule.test.source === rule.test.source);
		if (index > -1) {
			config.module.rules[index] = rule;
		}
	});
}

config.output = {
	path: path.resolve(__dirname, 'www/static/build/'),
	filename: '[name].js',
	chunkFilename: 'chunk.[id].[name]_[chunkhash:7].js',
	pathinfo: true,
	publicPath: midwayConf.publicPath,
};
// 感觉有风险
config.resolve.modules = [
	'output/node_modules',
	'node_modules',
];

const rules = [{
	test: /\.(ttf|woff)\b/i,
	loader: 'file-loader', // 该项目不内嵌
	options: {
		emitFile: false,
		name: '[path][name].[ext]',
		publicPath: '/',
	},
}, {
	test: /\.(eot|svg)\b/i,
	loader: 'file-loader',
	options: {
		emitFile: false,
		name: '[path][name].[ext]',
		publicPath: '/',
	},
}];
replaceRules(rules);

config.plugins[0] = new webpack.DefinePlugin({
	'typeof window': JSON.stringify('object'),
	'typeof process': JSON.stringify('undefined'),
	'process.env': {
		browser: JSON.stringify(true),
		NODE_ENV: JSON.stringify('production'),
	},
});
config.devtool = '#source-map';
config.stats = {};
module.exports = config;
