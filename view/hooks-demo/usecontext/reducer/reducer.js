import React from 'react';
import View from 'components/view';
import { ContextProvider } from '../components/reducer';
import Counter from './counter';
import CounterTest from './countertest';
import './style/index.less';

// 使用context
function Reducer() {
	return (
		<View className="reducer">
			<ContextProvider>
				<Counter />
				<CounterTest />
			</ContextProvider>
		</View>
	);
}

export default Reducer;
