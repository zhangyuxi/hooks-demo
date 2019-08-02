/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import View from 'components/view';
import { ContextProvider } from '../components/context';
import Child from './child.js';
import './style/index.less';

// 使用context
function Page() {
	const [count, setCount] = useState(0);
	const increment = () => {
		setCount(count + 1);
	};
	return (
		<View className="page">
			<ContextProvider value={{ count, increment }}>
				<Child />
			</ContextProvider>
		</View>
	);
}

export default Page;
