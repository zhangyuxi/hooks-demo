import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isMaybe from 'tcomb/lib/isMaybe';
import { Table, message } from 'antd';
import { t } from '../form';

export default class extends Component {
	static propTypes = {
		remote: PropTypes.shape({
			params: PropTypes.object,
		}).isRequired,
		dataFilter: PropTypes.func,
		getColumns: PropTypes.func,
		disabledSorter: PropTypes.bool,
		renderTableRecId: PropTypes.any,
		fetchAfter: PropTypes.any,
		columns: PropTypes.array.isRequired,
		rowKey: PropTypes.func,
		editId: PropTypes.any,
		locale: PropTypes.any,
		loading: PropTypes.bool,
		loadAppendItems: PropTypes.func,
		listFilter: PropTypes.func,
	};
	static defaultProps = {
		dataFilter: data => data,
		getColumns: null,
		disabledSorter: false,
		renderTableRecId: null,
		fetchAfter: null,
		editId: null,
		rowKey: undefined,
		locale: {
			emptyText: <span className="table-placeholder-inner" >暂无数据</span>,
		},
		loading: true,
		loadAppendItems: () => [],
		listFilter: list => list,
	}
	constructor(props) {
		props.remote.params = { // eslint-disable-line
			pageSize: 10,
			pageNo: 1,
			...props.remote.params,
		};
		super(props);

		const {
			pageSize,
			pageNo,
		} = props.remote.params;

		this.state = {
			data: {},
			list: [],
			pagination: {
				pageSize,
				current: pageNo,
				showQuickJumper: false,
				...props.pagination,
			},
			loading: this.props.loading === true,
		};
	}
	componentDidMount() {
		this.fetch(this.props.remote.params);
	}
	componentWillReceiveProps({
		remote,
		pagination: nextPagination,
	}) {
		if (remote !== this.props.remote) {
			const {
				pageSize,
				current,
				...pagination
			} = this.state.pagination;
			const params = {
				pageSize,
				pageNo: current,
				...remote.params,
			};

			this.setState({
				pagination: {
					...pagination,
					...nextPagination,
					pageSize: params.pageSize,
					current: params.pageNo,
				},
			}, () => {
				this.fetch(params);
			});
		}
	}
	static getValue(els, columns) {
		const value = {};
		const errMsg = [];
		columns.forEach((col) => {
			const name = col.dataIndex;
			const el = els[name];

			if (el) {
				if ('value' in el) {
					value[name] = el.value;
				} else if (el.length && el[0].type === 'radio') {
					value[name] = Array.from(el).find(item => item.checked).value;
				}

				const val = (col.valueType && isMaybe(col.valueType)) ? (value[name] || null) : value[name];
				const validate = col.valueType && t.validate(val, col.valueType, {
					context: {
						options: {
							label: col.title,
						},
					},
				});
				validate && !validate.isValid() && errMsg.push({
					title: `"${col.title}"填写错误`,
					content: validate.firstError().message,
				});
			}
		});

		return {
			value,
			errMsg,
		};
	}
	handleTableChange = (pagination, filters, sorter) => {
		if (this.props.disabledSorter && sorter.order) {
			message.info('暂不支持该功能');
			return false;
		}
		const pager = this.state.pagination;
		pager.current = pagination.current;

		this.setState({
			pagination: pager,
		});

		const params = {
			...this.props.remote.params,
			pageSize: pagination.pageSize,
			pageNo: pagination.current,
			sortField: sorter.field,
			sortOrder: sorter.order,
		};
		Object.keys(filters).forEach((key) => {
			params[key] = filters[key];
		});
		return this.fetch(params);
	}
	fetch = (params) => {
		// isFetch为此次请求开关，false-不发送，true||无此参数-发送
		if (this.props.remote.params.isFetch === false) {
			this.setState({
				loading: false,
			});
			return false;
		}
		this.setState({
			loading: this.props.loading,
		});
		return apiInfo({
			...this.props.remote,
			params,
		}).then((res) => {
			const data = this.props.dataFilter(res || {});
			const list = data ? (data.dataList || []) : [];
			this.setState({
				loading: false,
				data,
				list,
				pagination: {
					...this.state.pagination,
					total: data && +data.records,
					current: data && +data.pageNo,
				},
			});
			// 表格列表无后端返回序号时，前端根据pageNo渲染
			if (this.props.renderTableRecId && typeof (this.props.renderTableRecId) === 'function') {
				const pager = {
					pageSize: this.state.pagination.pageSize,
					pageNo: data && data.pageNo,
				};
				this.props.renderTableRecId(pager);
			}
		}).catch(() => {
			this.setState({
				list: [],
			});
		}).finally(() => {
			this.setState({
				loading: false,
			});
			// 防止角色权限变更，页面并行接口响应顺序不同，导致的提示信息错误或者额外请求的现象：串行请求

			if (this.props.fetchAfter && typeof (this.props.fetchAfter) === 'function') {
				return this.props.fetchAfter();
			}
			return true;
		});
	}
	transColumnsFun(editId, rowKey) {
		return (col) => {
			const _render = col.render;
			const { renderEdit } = col;
			return {
				...col,
				render: (text, record) => {
					const id = typeof rowKey === 'function' ? rowKey(record) : record[rowKey];

					if (id === editId && renderEdit) {
						return renderEdit(text, record);
					}
					return _render ? _render(text, record) : <span>{text}</span>;
				},
			};
		};
	}
	render() {
		const {
			columns: propColumns = [],
			getColumns,
			listFilter,
			rowKey,
			editId,
			locale,
			// pagination: _pagination,
			loading: _loading,
			...props
		} = this.props;
		const {
			list,
			pagination,
			loading,
		} = this.state;

		let dataSource = list;
		if (listFilter) {
			dataSource = listFilter(dataSource);
		}

		let columns = propColumns;
		if (getColumns) {
			columns = getColumns(this.state.data);
		}

		if (typeof editId === 'string') {
			columns = columns.map(this.transColumnsFun(editId, rowKey));
		} else if (String(editId) === '[object Object]') {
			dataSource = [editId, ...dataSource];
			columns = columns.map(this.transColumnsFun(editId.key, rowKey));
		}

		return (<Table
			dataSource={dataSource}
			pagination={pagination}
			loading={loading}
			onChange={this.handleTableChange}
			columns={columns}
			rowKey={rowKey}
			locale={locale}
			{...props}
		/>);
	}
}
