import fs from 'fs';

const boudlesInfoPath = `${think.ROOT_PATH}${midwayConf.reactLoadableInfoPath}`;
let bundlesInfo = think.safeRequire(boudlesInfoPath);
let publicPath = midwayConf.publicPath;

if (think.env === 'development') {
	publicPath = '/static/build/';
	bundlesInfo = () => JSON.parse(fs.readFileSync(boudlesInfoPath));
}

export default {
	type: 'react',
	content_type: 'text/html',
	file_ext: '.html',
	file_depr: '_',
	root_path: `${think.ROOT_PATH}/view`,
	file_name: 'routes.js',
	server_render: false,
	bundlesInfo,
	publicPath,
	log: true,
};
