import React from 'react'; // eslint-disable-line
import View from 'components/view';
import './style/index.less';

function IcpLicense(props) {
	return <View className="icp-license">{props.children}</View>;
}

export default IcpLicense;
