import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Page from './page';
import Reducer from './reducer';

export default function Usestate({ match }) {
	return (<Switch>
		<Route exact path={`${match.url}/page`} component={Page} />
		<Route exact path={`${match.url}/reducer`} component={Reducer} />
	</Switch>);
}
