
import React, { useState, useMemo } from 'react';
import View from 'components/view';
import './style/index.less';


function Usememo() {
	const [count, setCount] = useState(0);
	const [val, setValue] = useState('');
	// function expensive() {
	// 	console.log('ddd');
	// 	let sum = 0;
	// 	for (let i = 0; i < count * 1e9; i++) {
	// 		sum += i;
	// 	}
	// 	return sum;
	// }
	// usememo
	const expensive = useMemo(() => {
		let sum = 0;
		for (let i = 0; i < count * 1e9; i++) {
			sum += i;
		}
		return sum; // 返回值是整个usememo的返回值
	}, [count]); // 只有count变化时，回调函数才会执行
	return (<View className="pannel">
		<h4 className="title">You clicked {expensive} times</h4>
		<button onClick={() => setCount(count + 1)}>click me</button>
		<input value={val} onChange={event => setValue(event.target.value)} />
	</View>);
}

export default Usememo;
