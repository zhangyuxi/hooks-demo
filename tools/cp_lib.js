/* eslint-disable */
const copy = require('fs-promise').copy;
const resolve = require('path').resolve;

const basePath = `${resolve(__dirname, '..')}/`;
const argv = Array.prototype.concat.apply([], process.argv);

const staticDir = 'static';
const releaseType = argv[2] || 'dev';

const resPath = basePath;

console.log('releaseType', releaseType);

const cpList = releaseType === 'dev' ? {
	'babel-polyfill': 'babel-polyfill/dist/polyfill.js',
	bluebird: 'bluebird/js/browser/bluebird.min.js',
	fetch: 'whatwg-fetch/fetch.js',
	react: 'react/umd/react.development.js',
	'react-dom': 'react-dom/umd/react-dom.development.js',
	'sw/sw-toolbox': 'sw-toolbox/sw-toolbox.js',
	'sw/url-search-params': 'url-search-params/build/url-search-params.js',
	'monitor-inline': '@cmiot/monitor/lib/monitor_inline.js',
} : {
	'babel-polyfill': 'babel-polyfill/dist/polyfill.min.js',
	bluebird: 'bluebird/js/browser/bluebird.min.js',
	fetch: 'whatwg-fetch/fetch.js',
	react: 'react/umd/react.production.min.js',
	'react-dom': 'react-dom/umd/react-dom.production.min.js',
	'sw/sw-toolbox': 'sw-toolbox/sw-toolbox.js',
	'sw/url-search-params': 'url-search-params/build/url-search-params.js',
	'monitor-inline': '@cmiot/monitor/lib/monitor_inline.js',
};

Object.keys(cpList).forEach((lib) => {
	copy(`${resPath}node_modules/${cpList[lib]}`, `${basePath}www/${staticDir}/js/lib/${lib}.js`);
});
