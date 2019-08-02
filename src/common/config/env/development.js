import moment from 'moment';

export default {
	auto_reload: true,
	log_request: true,
	log: {
		type: 'txt',
	},
	gc: {
		on: false,
	},
	error: {
		detail: true,
	},
	transpond: {
		rs: {
			apiType: 'restful',
			host: 'xxx',
			port: 'xxx',
			path: '/xxx'
		},
		captcha: {
			apiType: 'restful',
			host: '172.19.1.94',
			port: '80',
			path: '/captcha/index',
		},
		log: true,
	},
	upload: {
		ftp: {
			host: 'xxx',
			port: 'xxx',
			user: 'xxx',
			password: 'xxx',
			log_connect: true
		},
		ftpPath: 'upload/xxx/',
		ftpUrl: 'http://xxx',
		
		ps_upload: {
			// http_proxy: 'http://127.0.0.1:8118',
			href_upload: 'http://172.19.1.110:8008/file-upload-api',
			href_download: 'http://172.19.1.110:8008/file-download-api',
			serviceAcount: 'testAcount',
			serviceKey: 'test123789456',
			serviceCode: 'testCode',
			appCode: 'testApp',
			upload_url_transfer(uploadUrl) {
				return uploadUrl.replace('http://183.230.40.68:8089', 'http://172.19.1.110:8008');
			},
		},
		parser(options) {
			return {
				defaultOpt: {
					expTime: moment().format('YYYY-MM-DD'),
					filePath: moment().format('YYYYMMDD'),
				},
			};
		},
		log: true,
	},
	session: {
		type: 'file',
		timeout: 24 * 3600, // session失效时间，单位：秒
	},
	redis: {
		host: 'xxx',
		port: 'xxx',
		password: 'xxx',
		timeout: 0,
		log_connect: true,
	},
};