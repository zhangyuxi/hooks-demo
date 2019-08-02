import React from 'react';
import { withRouter } from 'react-router-dom';
import NotFound from './not-found';

export default withRouter(({ children, location, history, NotFoundPage = NotFound }) => {
	let is404 = false;
	if (typeof window !== 'undefined' && window.__reactrouter__404) {
		if (window.__reactrouter__404 === true) {
			window.__reactrouter__404 = location.key;
		}
		if (window.__reactrouter__404 === location.key) {
			is404 = true;
		}
	}
	return is404 ? <NotFoundPage location={location} history={history} /> : children;
});
