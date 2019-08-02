
import React, { useState } from 'react';
import View from 'components/view';
import './style/index.less';


function useDoubleClick() {
	const [lastClickTime, setClickTime] = useState(0);

	return callback => (e) => {
		const currentTime = e.timeStamp;
		const gap = currentTime - lastClickTime;
		if (gap > 0 && gap < 300) {
			callback && callback(e);
		}
		setClickTime(currentTime);
	};
}
function Custom() {
	const [editing, setEditing] = useState(false);
	const textOnDoubleClick = useDoubleClick();
	return (
		<View>
			{
				editing ?
					<input /> : <View
						onClick={textOnDoubleClick(() => setEditing(true))}
					>
					双击
					</View>
			}
		</View>
	);
}
export default Custom;
