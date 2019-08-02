import React, { useContext } from 'react';
import View from 'components/view';
import { myContext } from '../../components/context';
import './style/index.less';

// 使用context
function User() {
	const { state } = useContext(myContext);
	return (
		<View className="user">
			<p>当前用户信息为：{state.userInfo && state.userInfo.mobile}</p>
		</View>
	);
}

export default User;
