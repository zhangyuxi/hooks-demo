/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import View from 'components/view';
import { myContext } from '../../components/context';
import './style/index.less';

// 使用context
function Login(props) {
	const { state, dispatch } = useContext(myContext);
	return (
		<View className="login">
			<p>当前用户手机号为：{state.userInfo && state.userInfo.mobile}</p>
			<button onClick={() => dispatch({ type: 'update', userInfo: { mobile: '15730174139' } })}>登录</button>
			<button onClick={() => props.history.push('/home/user')}>跳转到user页</button>
		</View>
	);
}

export default Login;
