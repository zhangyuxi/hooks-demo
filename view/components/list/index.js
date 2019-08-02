import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListView from 'rmc-list-view'

function Fail(props) {
	return <div style={{ padding: 20, textAlign: 'center' }}>加载失败</div>;
}
function Loading(props) {
	return <div style={{ padding: 20, textAlign: 'center' }}>加载中...</div>;
}

function noop() { }

export default class List extends Component {
	static propTypes = {
		remote: PropTypes.shape({
			params: PropTypes.object
		}).isRequired,
		renderItem: PropTypes.func.isRequired,
		topItems: PropTypes.array,
		remoteFilter: PropTypes.func,
	};
	static defaultProps = {
		renderLoading() {
			return <Loading />
		},
		renderFail(reloadHandle) {
			return <Fail onReload={reloadHandle} />
		},
		remoteFilter(remote) {
			return remote;
		},
		renderEmpty: noop,
		topItems: [],
	}
	constructor(props) {
		props.remote.params = {
			pageSize: 20,
			pageNo: 0,
			...props.remote.params
		};
		super(props);

		const { pageSize, pageNo } = props.remote.params;

		const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
		const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

		const dataSource = new ListView.DataSource({
			getRowData,
			getSectionHeaderData: getSectionData,
			rowHasChanged: (row1, row2) => {
				if (row1 !== row2) {
					return true;
				}
				// console.log(row2._changed, '_changed')
				if (row2._changed === true) {
					delete row2._changed;
					return true;
				}

				return false;
			},
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});

		this.rowIDs.unshift(props.topItems.map((_, i) => 'top' + i).reverse());

		this.state = {
			dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
			isLoading: false,
			isInit: props.topItems.length > 0,
			isFinish: false,
			pageSize,
			pageNo
		};
	}
	dataBlob = {};
	sectionIDs = ['top'];
	rowIDs = [];
	componentDidMount() {
		this.fetch(this.props.remote.params).then((data) => {
			// setState 在 Android 4.1 下会报错
			this.setState({
				isInit: data && data.dataList && data.dataList.length > 0 || 'empty'
			});
		}).catch((e) => {
			console.error(e);
			this.setState({
				isInit: 'fail'
			});
		});
	}
	componentWillReceiveProps({ remote, topItems }) {
		const { dataSource } = this.state;

		if (topItems !== this.props.topItems) {
			const topBlob = {};
			topItems.forEach((item, index) => {
				topBlob['top' + index] = item;
			});
			Object.assign(this.dataBlob, topBlob);

			this.rowIDs.shift();
			this.rowIDs.unshift(topItems.map((_, i) => 'top' + i).reverse());
			// console.log(this.sectionIDs, this.rowIDs)

			this.setState({
				dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
				isInit: topItems.length > 0 ? true : this.state.isInit
			});
		} else if (remote !== this.props.remote) {
			this.setState({
				dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs)
			});
		}
	}
	fetch = (params = {}) => {
		const remote = this.props.remoteFilter({
			...this.props.remote,
			params: {
				...this.props.remote.params,
				...params
			}
		});
		return apiInfo(remote).catch((e) => {
			this.setState({
				isLoading: '请求出错'
			});

			throw e;
		}).then((data) => {
			let detail = data;

			if (this.props.dataFilter) {
				detail = this.props.dataFilter(detail || {}, remote);
			}

			const list = detail ? (detail.dataList || []) : [];
			const pageNo = detail && +detail.pageNo;

			if (list.length === 0) {
				this.setState({
					isFinish: true,
					isLoading: false
				});
				return data;
			}

			if ('pageNo' in params && pageNo !== params.pageNo) {
				throw new Error('pageNo is diffrent');
			}

			if (pageNo !== this.sectionIDs.length - 1) {
				window.console && console.error(`unexpect pageNo ${pageNo}|${this.sectionIDs.length}`);
			} else {
				this.sectionIDs[pageNo + 1] = pageNo;
				this.rowIDs[pageNo + 1] = [];
				list.forEach((item, index) => {
					const i = pageNo * this.state.pageSize + index;
					this.rowIDs[pageNo + 1].push(i);
					this.dataBlob[i] = item;
				});

				// new object ref
				this.sectionIDs = [].concat(this.sectionIDs);
				this.rowIDs = [].concat(this.rowIDs);
			}

			// console.log(this.dataBlob, this.sectionIDs, this.rowIDs);

			this.setState({
				dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
				isLoading: false,
				pageNo
			});

			return detail;
		});
	}
	endReachedHandle = (event) => {
		// console.log('reach end', event);

		const { pageNo, isFinish, isLoading } = this.state;

		if (!isFinish && isLoading !== true) {
			this.fetch({
				pageNo: +pageNo + 1
			});

			this.setState({
				isLoading: true
			});
		}
	}
	reloadHandle = (event) => {
		this.setState({
			isInit: false,
			isLoading: true
		});

		this.fetch().then(() => {
			this.setState({
				isInit: true
			});
		}).catch(() => {
			this.setState({
				isInit: 'fail'
			});
		});
	}
	render() {
		const { renderItem, renderEmpty, renderFail, renderLoading, ...props } = this.props;
		const { isInit, isLoading, isFinish, dataSource } = this.state;
		// console.log('list render', isInit, isLoading);

		return (isInit === false ?
			renderLoading()
			:
			isInit === true ?
				<ListView
					dataSource={dataSource}
					// renderHeader={() => <span>header</span>}
					// renderFooter={() => <div style={{ padding: 30, textAlign: 'center' }}>
					// 	{['加载完毕', '加载中...'][+isLoading] || isLoading}
					// </div>}
					renderFooter={() => isLoading === true ? <Loading /> : (isFinish && <div style={{ padding: 20, textAlign: 'center' }}>已经没有更多内容</div>)}
					// renderSectionHeader={(sectionData) => (
					// 	<div>{`任务 ${sectionData.split(' ')[1]}`}</div>
					// )}
					renderRow={renderItem}
					// renderSeparator={separator}
					pageSize={4}
					scrollEventThrottle={20}
					// onScroll={() => { console.log('scroll'); }}
					onEndReached={this.endReachedHandle}
					onEndReachedThreshold={10}
					stickyHeader
					// stickyProps={{
					// 	stickyStyle: { zIndex: 999, top: 43 },
					// 	topOffset: -43,
					// }}
					{...props}
				/>
				:
				<div className={`list-${isInit}`}>
					{isInit === 'fail' && renderFail(this.reloadHandle)}
					{isInit === 'empty' && renderEmpty()}
				</div>);
	}
}