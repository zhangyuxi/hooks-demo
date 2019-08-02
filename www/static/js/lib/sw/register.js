if (navigator.serviceWorker) {
	if (G.context.sw) {
		navigator.serviceWorker.register && navigator.serviceWorker.register(G.path.sw + '?p=' + G.project + '&ua=' + encodeURIComponent(navigator.userAgent));
	} else {
		navigator.serviceWorker.getRegistrations && navigator.serviceWorker.getRegistrations().then(function(registrations) {
			// console.log(registrations.scope)
			registrations.forEach(function(registration) {
				registration.unregister();
			});
		});
	}
}