/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import View from 'components/view';
import Counter from './counter.js';
import './style/index.less';

class Child extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: props.count,
		};
	}
	// componentWillReceiveProps(nexprops) {
	// 	this.setState({
	// 		count: nexprops.count,
	// 	});
	// }
	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			count: nextProps.count,
		};
	}
	render() {
		const {
			count,
		} = this.state;
		return (
			<View className="child">
				<Counter count={count} increment={this.props.increment} />
			</View>
		);
	}
}

export default Child;
