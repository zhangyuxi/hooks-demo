/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint no-unused-vars: 0, import/extensions: 0, jsx-a11y/href-no-hash: 0 */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import View from 'components/view';
import { Icon, Menu, Dropdown, Modal, message } from 'antd';
import { withContext } from '../context';
// import IntlUnvsl from '../intl-universal';
import './style/index.less';

const { confirm } = Modal;

class RightNav extends Component {
	handleClick = (path) => {
		this.props.goto(path);
	}
	signOut = () => {
		const {
			userAction, history, signInfoAction, signInfo,
		} = this.props;
		apiInfo({
			cmd: 'signOut',
		}).then(() => {
			userAction.update(undefined);
			signInfoAction.update({ ...signInfo, signFailCount: 0 });
			history.push(`/login?ref=${encodeURIComponent(window.location.href)}`);
		});
	}
	showConfirm = () => {
		confirm({
			title: '退出登录',
			content: '是否退出当前账号？',
			okText: '确认',
			cancelText: '取消',
			onOk: () => this.signOut(),
			onCancel() {},
		});
	}
	render() {
		const { user } = this.props;
		const menu = (<Menu className="set-nav" selectable>
			<Menu.Item key="2" onClick={() => this.handleClick('/account/center')}>
				<a className="nav-item" >用户中心</a>
			</Menu.Item>
			<Menu.Item key="3" onClick={this.showConfirm}>
				<a className="nav-item" >退出登录</a>
			</Menu.Item>
		</Menu>);
		return (
			<View className="align-right">
				{user ? <Dropdown overlay={menu}>
					<a className="login-state">
						<span className="user-name">
							{user.userName}
						</span>
						<Icon type="caret-down" />
					</a>
				</Dropdown> : <span className="nav-login">
					<a
						className="nav-item"
						role="button"
						tabIndex={0}
						onClick={() => this.handleClick('/login')}
					>登录
					</a>
				</span>}
				{ /* <IntlUnvsl type="simple" /> */ }
			</View>
		);
	}
}

class UserNav extends Component {
	handleClick = (e, path) => {
		this.goto(path);
	}
	goto=(goPath) => {
		this.props.history.push(goPath);
	}
	toggleCollapsed = () => {
		this.props.toggleCollapsed(!this.props.collapsed);
	}
	render() {
		const {
			userAction, history, signInfoAction, signInfo, user, collapsed,
		} = this.props;
		return (<View className="nav-top">
			<Icon
				className="trigger"
				type={collapsed ? 'menu-unfold' : 'menu-fold'}
				onClick={this.toggleCollapsed}
			/>
			<RightNav
				user={user}
				userAction={userAction}
				history={history}
				signInfoAction={signInfoAction}
				signInfo={signInfo}
				goto={this.goto}
				handleClick={this.handleClick}
			/>
		</View>);
	}
}

export default withRouter(withContext(UserNav));
