import React, { Component } from 'react';
import { ContextProvider } from './context';
export default class App extends Component { //eslint-disable-line
	/* componentDidMount() {
		document.querySelector('title').innerHTML = G.context.title;
	}

	componentDidUpdate() {
		document.querySelector('title').innerHTML = G.context.title;
	} */

	render() {
		return (<div id="app-wraper">
			<ContextProvider userInfo={this.props.userInfo}>
				{this.props.children}
			</ContextProvider>
		</div>);
	}
}
