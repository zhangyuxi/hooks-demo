import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './login';
import User from './user';

export default function Usestate({ match }) {
	return (<Switch>
		<Route exact path={`${match.url}/login`} component={Login} />
		<Route exact path={`${match.url}/user`} component={User} />
	</Switch>);
}
