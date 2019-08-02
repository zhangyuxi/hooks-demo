/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import View from 'components/view';

class Counter extends Component {
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
			<View className="counter">
				<p> You cliked {count} times </p>
				<button onClick={this.props.increment}>Click me</button>
			</View>
		);
	}
}
export default Counter;
