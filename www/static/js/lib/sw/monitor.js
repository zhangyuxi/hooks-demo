self.monitorUrl = 'https://monitor.fe.ioteams.com/monitor/p.htm?p=' + self.urlParams.get('p') + '&type=sw&version=' + version;
self.monitor = function(data) {
	const params = new URLSearchParams();
	Object.keys(data).forEach(function(key) {
		params.append(key, data[key]);
	});
	const url = self.monitorUrl + '&' + params;
	return fetch(url, {
		method: 'post',
		// credentials: 'include'
	}).catch(function(event) {});
};
self.addEventListener('install', function(event) {
	monitor({
		event: 'install',
		data: JSON.stringify({
			userAgent: self.navigator.userAgent,
			windowUserAgent: self.urlParams.get('ua'),
			uaEqual: self.navigator.userAgent === self.urlParams.get('ua')
		})
	});
});
self.addEventListener('activate', function(event) {
	monitor({
		event: 'activate'
	});
});

self.addEventListener('error', function(event) {
	monitor({
		event: 'error',
		m: event.message,
		f: event.filename,
		l: event.lineno,
		c: event.colno,
		e: event.error.stack
	});
})
self.addEventListener('unhandledrejection', function(event) {
	monitor({
		event: 'unhandledrejection',
		r: event.reason instanceof Error ? event.reason.stack : event.reason
	});
});
