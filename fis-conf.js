/* global fis */
/* eslint-disable newline-per-chained-call */

const midwayConf = require('./midway.json');

const defaultModule = midwayConf.configurations.defaultModule;

const baseignore = ['/node_modules/**', '/output/**', '/fis-conf.js', 'runtime/**', '/pkg/**'];
const ignore = baseignore.concat([]);
const upignore = baseignore.concat('/src/common/config/**');

// 浏览器端资源只需要编译 html 文件，以及其用到的资源。
fis.set('project.files', [
	'/src/**',
	'/view/**',
	'/www/*.js',
	'/www/static/build/chunk.*', // chunk 为 webpack 生成，fis 依赖无法处理，整体拷贝
	'/map.json',
	'/midway.json',
	'/pm2.*',
	'react-loadable.json',
	`/www/${defaultModule}/**`,
]);
fis.set('project.ignore', ignore);

fis.media('update').set('project.ignore', upignore);

fis.match('*', {
	deploy: [
		fis.plugin('local-deliver', {
			to: 'output',
		}),
	],
});


// 静态通用压缩
fis.match('/www/static/**.js', {
	optimizer: fis.plugin('uglify-js'),
}).match('/www/static/**.css', {
	optimizer: fis.plugin('clean-css'),
}).match('/www/static/**.png', {
	optimizer: fis.plugin('png-compressor'),
}).match('*.html:js', {
	optimizer: fis.plugin('uglify-js'),
}).match('*.html:css', {
	optimizer: fis.plugin('clean-css'),
});


// 项目处理
fis.match('/{src,view}/**', {
	useMap: false,
}).match('/src/(**.js)', {
	parser: fis.plugin('babelcore'),
	release: '/app/$1',
}).match('/view/**.{js,jsx}', {
	parser: fis.plugin('babelcore'),
}).match('/www/(static/**)', {
	url: `/${defaultModule}/$1`,
	useHash: true,
}).match('/www/static/build/(**)', {
	// optimizer: false,
	release: '/www/static/pkg/$1',
	url: `/${defaultModule}/static/pkg/$1`,
}).match('/www/static/build/*.map', {
	release: false,
}).match('/www/static/build/chunk.*', {
	useHash: false,
}).match('/www/static/js/lib/*.js', {
	optimizer: false,
}).match('/www/static/js/lib/**.js', {
	packTo: 'www/static/pkg/lib.js',
}).match('/www/static/js/lib/monitor/monitor.js', {
	packTo: false,
}).match('/www/static/js/lib/sw/*.js', {
	packTo: false,
	optimizer: fis.plugin('uglify-js'),
}).match(`/www/(${defaultModule}/**)`, {
	url: '/$1',
});

fis.match('::package', {
	postpackager: fis.plugin('loader'),
});

fis.on('lookup:file', (info, file) => {
	const rest = info.rest || '';

	if (rest.indexOf('/static') === 0 || rest.indexOf(`/${defaultModule}`) === 0) {
		const realInfo = fis.uri(`${info.quote}/www${rest}${info.quote}`);
		fis.util.merge(info, realInfo);
	}
});
