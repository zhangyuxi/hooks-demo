import pathToRegexp from 'path-to-regexp';
import equal from 'fast-deep-equal';
import extend from 'extend';
import moment from 'moment';
import Audit4a from 'components/audit-4a';

export default function goldbank(apiInfo, preHooks) {
	let notice;

	if (!G.context.basename) {
		const modalMap = new Map();

		function initModal(opt) {
			const info = opt;
			const modal = $(`<div class="modal fade frame-modal-notice" tabindex="-1" role="dialog" aria-labelledby="goldbank" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<h4 class="modal-title">金库审批(${opt.info.operContent})</h4>
						</div>
						<div class="modal-body"></div>
					</div>
				</div>`).modal({
				backdrop: 'static',
				show: false
			});
			const bodyEl = modal.find('.modal-body');

			modal.on('show.bs.modal', function(e) {
				bodyEl.html(`<iframe src="${info.src}" key="${info.key}" frameBorder="0" width="${info.width}" height="${info.height}" />`);
			});
			modal.on('hidden.bs.modal', function(e) {
				bodyEl.html('');
				info.onClose && info.onClose();
				modalMap.delete(opt.key);
			});

			modalMap.set(opt.key, {
				info,
				modal,
			});

			return modal;
		}
		notice = {
			notice(opt) {
				initModal(opt).modal('show');
			},
			removeNotice(key) {
				const {
					info,
					modal,
				} = modalMap.get(key);
				info.onClose = null;
				modal.modal('hide');
			},
			destroy() {}
		};
	}

	Audit4a.init({
		// mode: window.localStorage ? window.localStorage.getItem('mode4a') : 'ie',
		mode: $.Browser.ie ? 'ie' : '',
		defaultValue: {
			appCode: "CQCLLS",
		},
		notice,
	});

	function transApprovalList(approvalList) {
		return approvalList.hasTrans ? approvalList : approvalList.map(rule => {
			rule.routeReg = pathToRegexp(rule.url);
			return rule;
		});
	}

	function getPathname(path) {
		const a = document.createElement('a');
		a.href = path;
		return a.pathname.startsWith('/') ? a.pathname : `/${a.pathname}`;
	}

	const auditInfoCache = {};

	function getAuditInfo(data) {
		const user = G.context.user;
		if (!user || !user.approvalList) {
			return null;
		}

		// 相同的method和path不再次触发审核
		const cache = auditInfoCache[`${data.method}|${data.path}`];
		let {
			pageNo: pageNo1,
			pageSize: pageSize1,
			...params,
		} = (data.params || {});
		let {
			pageNo: pageNo2,
			pageSize: pageSize2,
			...cacheParams,
		} = (cache && cache.data && cache.data.params || {});

		if (cache && moment().diff(cache.auditTime, 'm') < 5 && equal(cacheParams, params)) {
			return null;
		}

		const approvalList = transApprovalList(user.approvalList);
		const rule = approvalList.find(item => item.method.toLowerCase() === data.method.toLowerCase() && item.routeReg.test(getPathname(data.path)));
		return rule && {
			// mainLoginName: user.mainAcctIdDes,
			subLoginName: user.appAcctIdDes,
			operCode: rule.oprCodeDes,
			operContent: rule.description,
			svcNum: data.params.mobile || '',
		};
	}

	preHooks.push(async function goldbank(data) {
		const auditInfo = getAuditInfo(data);
		if (auditInfo) {
			try {
				const gbRes = await Audit4a.open(auditInfo);

				auditInfoCache[`${data.method}|${data.path}`] = {
					data: extend(true, {}, data),
					auditTime: moment(),
				};

				data.goldbank = gbRes.returnValue;
			} catch (err) {
				apiInfo.Message.error(err.errmsg);
				throw err;
			}
		}
	});
};
