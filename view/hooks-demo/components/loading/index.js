import React from 'react';

import {
	Spin,
} from 'antd';

import './style/index.less';

export default function loading(props) {
	return <Spin className="page-loading" delay={3000} />;
}
