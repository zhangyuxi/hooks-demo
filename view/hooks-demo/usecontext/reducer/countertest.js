import React, { useContext } from 'react';
import { myContext } from '../components/reducer';

function CounterTest(props) {
	const { state, dispatch } = useContext(myContext);
	return (
		<div>Count: {state.count}
			<button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
			<button onClick={() => dispatch({ type: 'increment' })}>+</button>
		</div>
	);
}

export default CounterTest;
