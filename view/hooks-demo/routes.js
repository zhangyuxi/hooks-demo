import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CaptureRouteNotFound, RouteNotFound } from 'components/404';

import App from './components/app';
import RouteChange from './components/route-change';

import Usestate from './usestate';
import Usecontext from './usecontext';
import Notcontext from './notcontext';
import Home from './home';
import Usememo from './usememo';
import Custom from './custom';
import Changeprops from './changeprops';

function pageChnage(props, nextProps) {
	G.referrer = props.location;

	if (process.env.browser) {
		try {
			// 统计
			window.monitor && window.monitor.getTrack && window.monitor.getTrack();
			window._czc && window._czc.push([
				'_trackPageview', props.history.createHref(nextProps.location),
				`${window.location.protocol}//${window.location.host}${props.history.createHref(G.referrer)}`,
			]);
		} catch (err) { /* console.log(err) */ }
	}
}

export default ({
	Provider,
	userInfo,
}) => function AppShell(props) {
	return (
		<Provider>
			<RouteChange
				onChange={pageChnage}
			>
				<App userInfo={userInfo}>
					<CaptureRouteNotFound>
						<Switch>
							<Redirect exact from="/" to="/usestate" />
							<Route exact path="/usestate" component={Usestate} />
							<Route path="/usecontext" component={Usecontext} />
							<Route path="/notcontext" component={Notcontext} />
							<Route path="/home" component={Home} />
							<Route path="/usememo" component={Usememo} />
							<Route path="/custom" component={Custom} />
							<Route path="/changeprops" component={Changeprops} />
							<RouteNotFound />
						</Switch>
					</CaptureRouteNotFound>
				</App>
			</RouteChange>
		</Provider>
	);
};
