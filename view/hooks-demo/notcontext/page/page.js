/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import View from 'components/view';
import Child from './child.js';
import './style/index.less';


class Page extends Component {
	constructor() {
		super();
		this.state = {
			count: 0,
		};
	}
	increment = () => {
		this.setState({
			count: this.state.count + 1,
		});
	}
	render() {
		const {
			count,
		} = this.state;
		return (
			<View className="page">
				<Child count={count} increment={this.increment} />
			</View>
		);
	}
}

export default Page;
