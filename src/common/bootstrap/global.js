import midwayBase from 'midway-base';

global.noop = function noop() {};

const G = {
	root: `/${midwayConf.defaultModule}`,
	project: midwayConf.project,
};
G.path = {
	login: `${G.root}/login`,
	goldbank: `${G.root}/goldbank`,
	captcha: `${G.root}/api/captcha`,
	upload: `${G.root}/upload`,
	outFtpUrl: '',
	innerFtpUrl: '',
};
G.download = {
	device_import_tml: `${G.root}/download/device_import_template.xlsx`,
};


midwayBase.init(G);
