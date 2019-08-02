import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Page from './page';

export default function Usestate({ match }) {
	return (<Switch>
		<Route exact path={`${match.url}/page`} component={Page} />
	</Switch>);
}
