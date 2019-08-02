import React from 'react';
import classnames from 'classnames';
import loadSprite from './load-sprite';

import './style/index.less';

export default class Icon extends React.Component {
	componentDidMount() {
		loadSprite();
	}
	render() {
		const {
			type,
			className,
			...restProps
		} = this.props;

		return !!type && (
			<svg focusable="false" className={classnames('ioticon', `ioticon-${type}`, className)} {...restProps}>
				<use xlinkHref={`#${type}`} />
			</svg>
		);
	}
}
