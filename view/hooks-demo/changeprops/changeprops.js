/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component, useState, useEffect, useRef } from 'react';
import View from 'components/view';
import './style/index.less';


function ChangChild(props) {
	const [value, setValue] = useState(props.data);
	useEffect(() => {
		setValue(props.data);
	}, [props.data]);
	return (
		<View className="counter-panel">
			当前count为：{value}
			<button onClick={() => setValue(Date.now())}>点击count+1</button>
		</View>
	);
}

function Changeprops() {
	const [count, setCount] = useState(0);
	return (
		<View className="pannel">
			<h4 className="title">计数器</h4>
			<ChangChild data={count} setData={setCount} />
		</View>
	);
}

export default Changeprops;
