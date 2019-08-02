/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component, useState, useEffect, useRef } from 'react';
import View from 'components/view';
import './style/index.less';

// counter 没有使用useState
class Counter1 extends Component {
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
			<View className="counter-panel">
				<p> counter 没有使用useState</p>
				<p> You cliked {count} times </p>
				<button onClick={this.increment}>Click me</button>
			</View>
		);
	}
}
// counter 使用useState
function Counter2() {
	const [count, setCount] = useState(0);
	return (
		<View className="counter-panel">
			<p> counter 使用useState</p>
			<p> You cliked {count} times </p>
			<button onClick={() => setCount(count + 1)}>Click me</button>
		</View>
	);
}

class CountDown1 extends Component {
	constructor() {
		super();
		this.state = {
			time: 60,
		};
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	start = false
	toggleStart = () => {
		this.start = !this.start;
		if (this.start) {
			this.interval = setInterval(() => {
				this.setState({
					time: this.state.time - 1,
				});
			}, 1000);
		} else {
			clearInterval(this.interval);
		}
	}
	render() {
		const {
			time,
		} = this.state;
		return (
			<View className="counter-panel">
				<button onClick={this.toggleStart}>{time}</button>
			</View>
		);
	}
}

function CountDown2() {
	const [start, setStart] = useState(false);
	const [time, setTime] = useState(60);
	// const currentTime = useRef(time);   //生成一个可变的引用，该对象里只有current一个属性
	// const interval = useRef();  //interval 可以在这个作用域里任何地方清除和设置
	useEffect(() => {
		let interval;
		if (start) {
			interval = setInterval(() => {
				setTime(time - 1);   // time 在 effect 闭包函数里拿不到准确值的
				// setTime(t => t - 1);
				// setTime(currentTime.current--);
			}, 1000);
		}
		return () => clearInterval(interval);
		// return () => clearInterval(interval.current);
	}, [start]);
	return (
		<View className="counter-panel">
			<button onClick={() => setStart(!start)}>{time}</button>
		</View>
	);
}

function Counter() {
	return (<View>
		<View className="pannel">
			<h4 className="title">计数器</h4>
			<Counter1 />
			<Counter2 />
		</View>
		<View className="pannel">
			<h4 className="title">倒计时</h4>
			<CountDown1 />
			<CountDown2 />
		</View>
         </View>);
}

export default Counter;
