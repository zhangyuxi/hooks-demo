const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const midwayConf = require('./midway.json').configurations;
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

const extractLESS = new ExtractTextPlugin({
	filename: 'main.css',
	allChunks: true,
});

const reactLoadablePath = path.resolve(`${__dirname}${midwayConf.reactLoadableInfoPath}`);

/* function win2posix(p) {
	return p.replace(/\\/g, '/');
} */

module.exports = {
	entry: {
		main: path.resolve(__dirname, 'www/static/js/app.js'),
	},
	output: {
		path: path.resolve(__dirname, 'www/static/build/'),
		filename: '[name].js',
		pathinfo: true,
		publicPath: '/static/build/',
		/* devtoolModuleFilenameTemplate(info) {
			let resourcePath = win2posix(info.resourcePath);

			const d = win2posix(__dirname);
			const i = resourcePath.lastIndexOf(d);
			if (i > -1) {
				resourcePath = resourcePath.slice(i + d.length + 1);
			}

			resourcePath = path.posix.join(d.replace('e:', 'E:'), resourcePath);

			return `file:///${resourcePath}`;
		}, */
	},
	externals: [{
		bluebird: 'Promise',
		react: 'React',
		'react-dom': 'ReactDOM',
	}],
	resolve: {
		// mainFields: ['jsnext:main', 'browser', 'main'],
		alias: {
			view: `${__dirname}/view`,
			helper: `${__dirname}/view/helper`,
			components: `${__dirname}/view/components`,
			vendor: `${__dirname}/www/static/vendor`,
		},
	},

	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /(node_modules)/,
			loader: 'babel-loader',
			options: {
				babelrc: false,
				presets: [
					['env', {
						targets: {
							browsers: ['ie >= 9', 'Android >= 4', 'iOS >= 7'],
						},
						loose: true,
						modules: false,
					}],
					'stage-1',
					'react',
					'bluebird',
				],
				plugins: [
					'transform-decorators-legacy', [
						'import', [{
							libraryName: 'antd',
							style: true,
						}, {
							libraryName: 'antd-mobile',
							style: true,
						}],
					],
					'react-loadable/babel',
				],
			},
		}, {
			test: /\.(less|css)$/,
			use: extractLESS.extract([{
				loader: 'css-loader',
				options: {
					sourceMap: true,
				},
			},
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: true,
					plugins() { // postcss 插件
						// 该函数会多次执行
						// console.log('postcss')
						return [
							autoprefixer({
								browsers: ['Android >= 4', 'iOS >= 7'],
							}),
						];
					},
				},
			},
			{
				loader: '@iot/less-loader',
				options: {
					sourceMap: true,
				},
			},
			]),
		}, {
			test: /\.(eot|ttf|woff|svg)\b/i,
			loader: 'url-loader',
		}, {
			test: /\.(png|gif|jpg)\b/i,
			include: path.resolve(__dirname, 'www'),
			loader: 'file-loader',
			options: {
				emitFile: false,
				name: '[path][name].[ext]',
				context: path.resolve(__dirname, 'www'),
				publicPath: '/',
			},
		}, {
			test: /\.(png|gif|jpg)\b/i,
			exclude: path.resolve(__dirname, 'www'),
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]',
			},
		}],
		// noParse: []
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				browser: JSON.stringify(true),
				// NODE_ENV: JSON.stringify("production")
			},
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			minChunks: 2,
			children: true,
			async: 'common',
		}),
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
		// antd/antd-mobile 的 themes 替换。用 less 的 modifyVars 替换效率太低，用模块替换更好
		new webpack.NormalModuleReplacementPlugin(/(antd)[/\\]lib[/\\]style[/\\]themes[/\\]default/, ((opt) => {
			if (opt.request.indexOf('css-loader') > -1) {
				return;
			}

			const origin = opt.request.indexOf('?origin');
			if (origin > -1) {
				opt.request = opt.request.slice(0, origin); // eslint-disable-line no-param-reassign
				return;
			}

			const request = opt.request.split('!');
			request.pop();
			const newPath = path.resolve(`${__dirname}/www/static/vendor/antd/themes.less`);
			request.push(newPath);
			opt.request = request.join('!'); // eslint-disable-line no-param-reassign
		})),
		extractLESS,
		new ReactLoadablePlugin({
			filename: reactLoadablePath,
		}),
	],

	devtool: '#module-inline-source-map',

	stats: {
		children: false,
		modules: false,
	},
};
