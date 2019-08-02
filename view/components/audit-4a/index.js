import moment from 'moment';
import extend from 'extend';

let notificationInstance;
const defaultDuration = null;
let defaultWidth = 700;
let defaultHeight = 500;

function initNotificationInstance(instance) {
	if (instance) {
		notificationInstance = instance;
		return;
	}
	instance = require('rc-notification').default.newInstance({ // eslint-disable-line
		prefixCls: 'frame-modal',
		style: {
			top: 0,
			right: 0,
		},
	});
	notificationInstance = {
		notice({ src, key, onClose, duration, prefixCls, width, height }) {
			return instance.notice({
				content: (
					<iframe src={src} frameBorder="0" width={width} height={height} /> // eslint-disable-line
				),
				duration,
				closable: true,
				onClose,
				key,
				style: {},
			});
		},
		removeNotice(...args) {
			return instance.removeNotice(...args);
		},
		destroy() {
			return instance.destroy();
		},
	};
}

const api = {
	isInit: false,
	mode: '!ie',
	defaultValue: {
		appCode: '',
		sessionId: '',
		mainLoginName: '',
		subLoginName: '',
		operCode: '',
		operContent: '',
		busyType: '',
		systemId: '',
		resAcctId: '',
		serverIp: '',
		serverPort: '',
		checkSessionUrl: '',
		isBasedOnLogin: false,
		svcNum: '',
	},
	value: null,
	open(goldData) {
		if (!this.isInit && window) {
			this.init();
		}
		if (this.value) {
			return Promise.reject({
				errno: '-1',
				errmsg: '已有窗口打开',
			});
		}
		this.value = {
			key: moment.now(),
			onClose: this.onClose,
			width: defaultWidth,
			height: defaultHeight,
			duration: defaultDuration,
			prefixCls: 'frame-modal-notice',
		};

		return new Promise((resolve, reject) => {
			this.value.resolve = resolve;
			this.value.reject = reject;
			// 请求金库
			const reqData = {
				...this.defaultValue,
				...goldData,
			};

			if (this.mode !== 'ie') {
				const params = $.ObjectH.encodeURIJson(reqData); // eslint-disable-line
				this.value.src = `${G.path.goldbank}?${params}`;
				this.value.info = reqData;
				notificationInstance.notice(this.value);
			} else {
				if (!window.showModalDialog) {
					reject({
						errno: '1',
						errmsg: '请使用IE浏览器或切换4A兼容模式',
					});
					return;
				}
				const iWidth = 700; // 模态窗口宽度
				const iHeight = 500;// 模态窗口高度
				const iTop = (window.screen.height - iHeight - 100) / 2;
				const iLeft = (window.screen.width - iWidth) / 2;

				// 解决ie卡死的问题
				setTimeout(() => {
					const returnValue = window.showModalDialog(__uri('/static/html/goldbank.html'), reqData, `dialogHeight:${iHeight}px; dialogWidth:${iWidth}px; toolbar:no; menubar:no;  titlebar:no; scrollbars:no; resizable:no; location:no; status:no;left:${iLeft}px;top:${iTop}px;`);
					this.goldbankReturn(returnValue);
				}, 10);
			}
		}).finally(() => {
			this.value = null;
		});
	},
	init(opt) {
		this.listener = window.addEventListener('message', this.onMessage);

		const { notice, ...o } = opt;

		initNotificationInstance(notice);

		extend(true, this, o);

		this.isInit = true;
	},
	goldbankReturn(returnValue = '') {
		const resData = returnValue.split('#');
		const resNo = resData[0];
		const info = this.resMap[resNo] || {
			errno: '-1',
			errmsg: '金库未响应',
		};
		if (info.errno === '0') {
			this.value.resolve({
				...info,
				returnValue,
			});
		} else {
			this.value.reject(info);
		}
	},
	resMap: {
		'-3': {
			errmsg: '金库应急开启中，允许业务继续访问',
			errno: '0',
		},
		'-2': {
			errmsg: '金库场景或原业务未开启，允许业务继续访问',
			errno: '0',
		},
		1: {
			errmsg: '审批通过，允许业务继续访问',
			errno: '0',
		},
		2: {
			errmsg: '超时，允许业务继续访问',
			errno: '0',
		},
		5: {
			errmsg: '未配置策略，允许业务继续访问',
			errno: '0',
		},
		3: {
			errmsg: '超时，不允许业务继续访问',
			errno: '3',
		},
		'-1': {
			errmsg: '直接关闭窗口，未申请审批，不允许业务继续访问',
			errno: '-1',
		},
		0: {
			errmsg: '审批不通过，不允许业务继续访问',
			errno: '1',
		},
		4: {
			errmsg: '出现错误异常（包括数据异常），不允许业务继续访问',
			errno: '4',
		},
		6: {
			errmsg: '未配置策略，不允许业务继续访问',
			errno: '6',
		},
	},
	onMessage(res) {
		const data = res.data;
		const type = data.type;
		if (type === 'close' && api.value) {
			api.close(api.value.key);
			const returnValue = data.returnValue;
			api.goldbankReturn(returnValue);
		}
	},
	onClose() {
		api.value.reject({
			errno: '-1',
			errmsg: '直接关闭窗口，未申请审批，不允许业务继续访问',
		});
	},
	config(options) {
		if ('width' in options) {
			defaultWidth = options.width;
		}
		if ('height' in options) {
			defaultHeight = options.height;
		}
	},
	close(key) {
		if (notificationInstance) {
			notificationInstance.removeNotice(key);
		}
	},
	destroy() {
		if (notificationInstance) {
			notificationInstance.destroy();
			notificationInstance = null;
		}
		window.removeEventListener('message', this.onMessage);
	},
};


export default api;
