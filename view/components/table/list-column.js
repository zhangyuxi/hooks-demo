import React from 'react';
import { Menu, Icon } from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';

export default function ListColumn() {
	if (!this.props.list) {
		return <span />;
	}
	const { list } = this.props.list;
	const menu = (<Menu>
		{list.map((item, index) => (<Menu.Item key={index}>
			{item}
		</Menu.Item>))}
	</Menu>);

	return (<span>
		<em>{list.length}</em>
		{list.length > 0 && <Dropdown overlay={menu} trigger={['click']}>
			<Icon className="icon-btn" type="toggle-down" style={{ marginLeft: 10 }} />
		</Dropdown>}
	</span>);
}
