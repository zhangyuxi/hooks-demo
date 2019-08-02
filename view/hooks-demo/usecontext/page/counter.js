/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import View from 'components/view';
import { myContext } from '../components/context';



// 使用context
function Counter() {
	const { count, increment } = useContext(myContext);
	return (
		<View className="counter">
			<p> You cliked {count} times </p>
			<button onClick={increment}>Click me</button>
		</View>
	);
}

export default Counter;
