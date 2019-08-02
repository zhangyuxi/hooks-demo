export default {
	// session配置
	name: 'iot_hooks-demo', // session对应的cookie名称
	type: 'redis',
	path: '',
	secret: '',
	timeout: 0.25 * 3600, // session失效时间，单位：秒
	cookie: {
		httponly: true,
	},
};
