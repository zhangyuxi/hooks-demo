import apiInfo, {
	preHooks,
	postHooks,
} from 'iot-helper/lib/api-info';

// import goldbank from './api-info.goldbank';
// goldbank(apiInfo, preHooks);

preHooks.push(async function csrf(data) {
	data.csrfToken = G.context.signInfo && G.context.signInfo.csrfToken;
});

postHooks.push(async function rest(res, data, showError) {
	if (res.errno === 0) {
		return res.data;
	} else {
		showError !== false && apiInfo.Message.error(res.errmsg);

		if (res.errno === 401) { // session失效
			setTimeout(function() {
				window.location.href = G.path.login;
			}, 2000);
			res.errmsg = '未登录或登录过期';
		}

		throw res;
	}
});

export default apiInfo;
