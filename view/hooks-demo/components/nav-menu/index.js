/* eslint no-unused-vars: 0, import/extensions: 0, jsx-a11y/href-no-hash: 0 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import View from 'components/view';
import { Menu, message, Icon } from 'antd';
import { withContext } from '../context';
import './style/index.less';

class MenuNav extends Component {
	handleClick = (e, path) => {
		this.goto(path);
	}
	goto=(goPath) => {
		this.props.history.push(goPath);
	}
	render() {
		const menuInfo = [{
			menuName: '角色管理',
			menuId: '1',
			menuUrl: '/roles',
			menuIcon: 'solution',
		}, {
			menuName: '账号管理',
			menuId: '2',
			menuUrl: '/users',
			menuIcon: 'user',
		}, {
			menuName: '消息总线',
			menuId: '3',
			menuUrl: '/mbs',
			menuIcon: 'deployment-unit',
			subMenu: [{
				menuName: '生产者管理',
				menuId: '4',
				menuUrl: '/mbs/producer',
			}, {
				menuName: '消息类型管理',
				menuId: '5',
				menuUrl: '/mbs/message',
			}, {
				menuName: '消费者管理',
				menuId: '6',
				menuUrl: '/mbs/consumer',
			}, {
				menuName: '消息订阅管理',
				menuId: '7',
				menuUrl: '/mbs/subscriptions',
			}, {
				menuName: '设备集合管理',
				menuId: '8',
				menuUrl: '/mbs/collections',
			}],
		}];
		const { collapsed } = this.props;
		const { pathname } = this.props.history.location;
		const defaultUrl = `/${pathname.split('/')[1]}`;
		return (<View className="nav-left">
			<View className="logo" >
				{collapsed ?
					<img alt="" src={__uri('/static/img/logo-2.png')} className="main-logo" />
					:
					<img alt="" src={__uri('/static/img/logo-3.png')} className="main-logo" />
				}
			</View>
			{!this.props.noMenu && <Menu
				theme="dark"
				mode="inline"
				className="nav-menu"
				defaultOpenKeys={[defaultUrl]}
			>
				{menuInfo.map(menu => (menu.subMenu && menu.subMenu.length > 0 ? <Menu.SubMenu key={menu.menuUrl} title={<span>{menu.menuIcon && <Icon type={menu.menuIcon} />}<span>{menu.menuName}</span></span>}>
					{menu.subMenu.map(subMenu => (<Menu.Item
						className={classNames({
							'ant-menu-item-normal': !(pathname === subMenu.menuUrl),
							'ant-menu-item-active': pathname === subMenu.menuUrl,
							'ant-menu-item-selected': pathname === subMenu.menuUrl,
						})}
						key={subMenu.menuUrl}
						onClick={e => this.handleClick(e, subMenu.menuUrl)}
					>
						<span>{subMenu.menuName}</span>
					</Menu.Item>))}
				</Menu.SubMenu> : <Menu.Item
					className={classNames({
						'ant-menu-item-normal': !(pathname === menu.menuUrl),
						'ant-menu-item-active': pathname === menu.menuUrl || menu.menuUrl === defaultUrl,
						'ant-menu-item-selected': pathname === menu.menuUrl || menu.menuUrl === defaultUrl,
					})}
					key={menu.menuUrl}
					onClick={e => this.handleClick(e, menu.menuUrl)}
				>
					{menu.menuIcon && <Icon type={menu.menuIcon} />}
					<span>{menu.menuName}</span>
				</Menu.Item>))}
			</Menu>}
		</View>);
	}
}

export default withRouter(withContext(MenuNav));
