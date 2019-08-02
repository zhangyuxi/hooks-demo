import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function RouteNotFound() {
	return <Route render={({staticContext}) => {
		if (staticContext) {
			staticContext.state = 404;
		} else {
			window.__reactrouter__404 = true;
		}
		return <Redirect to={{}} />;
	}} />
}
