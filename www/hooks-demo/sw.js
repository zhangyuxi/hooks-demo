var version = '1.3.0';

self.__uri = function(src) {
	return src
};

function getRequest(request, init) {
	init = init || {};

	var headers = init.headers !== null ? new Headers(request.headers) : {};
	if (init.headers) {
		Object.keys(init.headers).forEach(function(key) {
			headers.append(key, init.headers[key]);
		})
	}

	return new Request(request.url, {
		headers: headers,
		mode: init.mode || request.mode === 'navigate' ? 'same-origin' : request.mode, // need to set this properly
		method: init.method || request.method,
		credentials: init.credentials || request.credentials,
		redirect: init.redirect || request.redirect,
		referrer: init.referrer || request.referrer
	});
}

!self.URLSearchParams && importScripts('/static/js/lib/sw/url-search-params.js');
self.urlParams = new URLSearchParams(location.search);

importScripts(__uri('/static/js/lib/sw/sw-toolbox.js'));
importScripts(__uri('/static/js/lib/sw/monitor.js'));

// 重置，去除 404 缓存
toolbox.options.successResponses = /^0|([123]\d\d)|(40[1567])|410$/;

self.addEventListener('install', function(event) {
	event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
});

toolbox.router.get('/:module/sw', toolbox.networkOnly);
toolbox.router.get('/static/(.*)', toolbox.cacheFirst);
/* 因页面可能带参数，会导致缓存无限制增长，等待 sw-toolbox 更新 */
/* toolbox.router.get('/(.*)', function(request, values, options) {
	var newRequest = getRequest(request, {
		// redirect: 'manual',
		headers: {
			'x-window-user-agent': self.urlParams.get('ua')
		}
	})
	return toolbox.networkFirst.apply(this, [newRequest, values, options]);
}, {
	cache: {
		// queryOptions: {
		// 	ignoreSearch: true,
		// },
	}
}); */
toolbox.router.get('/(.*)', function(request, values, options) {
	// 跨域，针对微信添加额外的头
	var newRequest = getRequest(request, {
		headers: null
	})
	return toolbox.cacheFirst.apply(this, [newRequest, values, options]);
}, {
	origin: /^https?:\/\/at\.alicdn\.com/,
	cache: {
		name: 'font_1457169990_5499172',
		maxEntries: 10,
		maxAgeSeconds: 60 * 60 * 24 * 7,
		// queryOptions: {
		// 	ignoreSearch: true,
		// },
	}
});