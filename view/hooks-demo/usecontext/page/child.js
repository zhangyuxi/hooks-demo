/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import View from 'components/view';
import Counter from './counter.js';
import './style/index.less';


// function Child() {
// 	return (
// 		<View className="child">
// 			<Counter />
// 		</View>
// 	);
// }
class Child extends Component {
	shouldComponentUpdate() {
		return false;
	}
	render() {
		return (
			<View className="child">
				<Counter />
			</View>
		);
	}
}

export default Child;
