import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Layout, Alert } from 'antd';
import NavMenu from './nav-menu';
import NavUser from './nav-user';
import { withContext } from './context';

const {
	Sider,
	Header,
	Content,
} = Layout;

class Container extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasAuth: 'defaultBlankBox',
		};
	}
	componentDidMount() {
		// 校验当前用户是否有当前页面的访问权限
		// const { user, location } = this.props;
		// const hasAuth = this.validateAccess(user, location);
		const hasAuth = true;
		this.setState({
			hasAuth,
		});
	}
	componentWillReceiveProps(nextProps) {
		// const { user, location } = nextProps;
		// const hasAuth = this.validateAccess(user, location);
		const hasAuth = true;
		this.setState({
			hasAuth,
		});
	}
	// 获取当前用户拥有权限的path
	getPath = (list) => {
		// 未写入自定义菜单数组的，默认菜单path
		const pathArr = ['/login', '/forget'];
		function getListPath(menuList) {
			menuList && menuList.forEach((item) => {
				if (item.url) {
					pathArr.push(item.url);
				}
				if (item.subMenuInfo && item.subMenuInfo.length) {
					getListPath(item.subMenuInfo);
				}
			});
		}

		getListPath(list);
		return pathArr;
	}
	// 校验当前用户是否有当前页面的访问权限
	validateAccess = (user, location) => {
		const curPath = location.pathname;
		const pathArr = this.getPath(user.auth && user.auth.menu);
		const vaguePath = ['/cluster/', '/account'];
		for (let i = 0; i < vaguePath.length; i += 1) {
			if (curPath.indexOf(vaguePath[i]) === 0) {
				return true;
			}
		}
		const ignPath = ['/service/dms', '/service/detail', '/servers/alarm'];
		for (let i = 0; i < ignPath.length; i += 1) {
			if (pathArr.indexOf(ignPath[i]) > -1 && curPath.indexOf(ignPath[i]) === 0) {
				return true;
			}
		}
		return pathArr.indexOf(curPath) > -1;
	}
	render() {
		const { hasAuth } = this.state;
		return (
			<Content id="container" className={this.props.className}>
				{
					// eslint-disable-next-line no-nested-ternary
					hasAuth === 'defaultBlankBox' ? null : (hasAuth ?
						<div className="content">
							{this.props.children}
						</div>
						:
						<div className="defaultBlankBox"><Alert message="对不起，您没有权限访问此页。" type="warning" showIcon /></div>)
				}
			</Content>
		);
	}
}


class AuthedPage extends Component {
	state = {
		collapsed: false,
	}
	toggleCollapsed = (collapsed) => {
		this.setState({
			collapsed,
		});
	}
	render() {
		const { collapsed } = this.state;
		const { user, location } = this.props;
		return (<Layout className="layout" style={{ flexDirection: 'row' }}>
			<Sider
				className="Sider"
				collapsed={collapsed}
			>
				<NavMenu collapsed={collapsed} />
			</Sider>
			<Layout>
				<Header className="header">
					<NavUser collapsed={collapsed} toggleCollapsed={this.toggleCollapsed} />
				</Header>
				<Container user={user} location={location}>
					{this.props.children}
				</Container>
			</Layout>
		</Layout>)
		// 正式开发用以下部分
		//return user ? (<Layout className="layout" style={{ flexDirection: 'row' }}>
		//	<Sider
		// 		className="Sider"
		// 		collapsed={collapsed}
		// 	>
		// 		<NavMenu collapsed={collapsed} />
		// 	</Sider>
		// 	<Layout>
		// 		<Header className="header">
		// 			<NavUser collapsed={collapsed} toggleCollapsed={this.toggleCollapsed} />
		// 		</Header>
		// 		<Container user={user} location={location}>
		// 			{this.props.children}
		// 		</Container>
		// 	</Layout>
		// </Layout>) : <Redirect to="/login" push />; // eslint-disable-line
	}
}

export default withContext(AuthedPage);
