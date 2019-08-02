// eslint-disable-next-line import/no-extraneous-dependencies
import NodeRSA from 'node-rsa';
import base from '../../common/controller/api';

function transPw(pw, {
	signInfo,
}) {
	let transedPw = '';

	if (signInfo.key) {
		const key = new NodeRSA(signInfo.key.privateKey);
		transedPw = key.decrypt(pw, 'utf8');
	} else {
		throw new Error('signInfo.key is not exist.');
	}

	think.log(think.md5(think.md5(transedPw)), 'transedPw=======');
	return think.md5(think.md5(transedPw));
}

export default class extends base {
	async indexAction() {
		await this.capture(() => this.rewrite());

		const data = this.post();
		const cmd = data.cmd || 'default';
		think.log(`api cmd: ${cmd}`, 'LOG');

		return this.capture(async () => {
			let resData;
			switch (cmd) {
			case 'signIn':
			{
				resData = await this.signIn(data.params);
				break;
			}
			case 'signOut':
			{
				resData = await this.signOut(data);
				break;
			}
			case 'getUserInfo':
			{
				resData = await this.getUserInfo(data);
				break;
			}
			case 'getUserDetail':
			{
				resData = await this.getUserDetail(data);
				break;
			}
			case 'getPubKey':
			{
				resData = await this.getPubKey();
				break;
			}
			default:
			{
				const server = data.server || 'rs';
				const transpond = this.getTranspond(think.config(`transpond.${server}`));
				resData = await this.transWithLogin(data, transpond);
			}
			}

			return this.success(resData);
		});
	}
	checkVerifycode(signInfo, data) {
		const shouldpass = signInfo.validate && signInfo.validate === data.verifycode;

		if (!shouldpass) {
			// eslint-disable-next-line no-param-reassign
			signInfo.validateLastFail = +new Date();
		}

		// eslint-disable-next-line no-param-reassign
		delete signInfo.validate;

		return shouldpass;
	}
	resetVerifycode(signInfo) {
		// 成功过后判断是否可以重置验证码计数
		const now = +new Date();
		const countResetTime = 1 * 3600 * 1000;
		think.log(signInfo.validateLastFail, now, countResetTime);
		if (!signInfo.validateLastFail || now - signInfo.validateLastFail > countResetTime) {
			// eslint-disable-next-line no-param-reassign
			signInfo.signFailCount = 0;
		}
	}
	passwordKeyList = ['password', 'newPassWord'];
	async captchaAction() {
		const transpond2Captcha = this.getTranspond(think.config('transpond.captcha'));
		try {
			const rawRes = await transpond2Captcha.send({
				method: 'post',
				path: '/',
				params: {},
			}, null, true);
			if (!rawRes.ok) {
				throw new Error('验证码请求出错');
			}
			const signInfo = await this.session('signInfo') || {};
			// const validInfo = await this.session('validInfo') || {};

			// signInfo.validate = rawRes.headers.validate;
			signInfo.validate = rawRes.headers.get('validate');
			think.log(`captcha validate: ${signInfo.validate}`, 'LOG');

			await this.session('signInfo', signInfo);
			this.http.header('Content-Type', 'image/jpeg');
			// 非 thinkjs 的 end 需手动调用内部接口。
			this.http._afterEnd();
			// console.log('this.http.res----------',this.http.res);
			rawRes.body.pipe(this.http.res);
			return null;
		} catch (err) {
			const {
				errno = 1000, errmsg = '', info, errInfo = 'ERROR',
			} = err;
			think.log(err, errInfo);
			return this.fail(errno, errmsg, info);
		}
	}
	async sendVerifyCode(data) {
		const transpond = this.getTranspond();
		const signInfo = await this.session('signInfo') || {};
		// const validInfo = await this.session('validInfo') || {};

		if (signInfo.validate !== data.params.verifycode) {
			signInfo.validate = Math.round(Math.random() * 9999);
			think.log('图片验证码错误', 'VALIDATE');
			throw {
				errmsg: '图片验证码错误，请输入正确的验证码',
				errno: 1000,
			};
		}

		signInfo.validate = Math.round(Math.random() * 9999);
		await this.session('signInfo', signInfo);

		const resData = await transpond.send(data);

		think.log(JSON.stringify(resData), 'resData: ');
		if (resData.result !== 0) {
			this.fail({
				errno: resData.result,
				errmsg: resData.resultNote,
			});
		}

		return resData;
	}
	async signIn(data) {
		const signInfo = await this.session('signInfo') || {};
		if (this.checkVerifycode && !this.checkVerifycode(signInfo, data)) {
			think.log('图片验证码错误', 'LOG');
			throw {
				errmsg: '图片验证码错误',
				errno: 400,
			};
		} else {
			try {
				const resData = await this.doAuth(data, signInfo);
				const userInfo = Object.assign({}, resData.detail);

				this.checkVerifycode && this.resetVerifycode && this.resetVerifycode(signInfo);

				think.log(`signInfo: ${JSON.stringify(signInfo)}`, 'LOG');
				await this.session('signInfo', signInfo);

				userInfo.token = '';
				await this.session('userInfo', userInfo);

				return resData;
			} catch (err) {
				think.log(`errno: ${err.errno}`, 'LOG');
				if (this.checkVerifycode && err.errno) {
					signInfo.signFailCount = Math.min((signInfo.signFailCount | 0) + 1, 10);

					think.log(`signInfo: ${JSON.stringify(signInfo)}`, 'LOG');

					await this.session('signInfo', signInfo);
					err.info = err.info || {};
					err.info.signFailCount = signInfo.signFailCount;
					err.errno = parseInt(`400${err.errno.toString().substr(3)}`, 10);
				}
				throw err;
			}
		}
	}
	async doAuth({
		auth,
		...data
	}, signData) {
		const signInfo = signData;
		const transpond = this.getTranspond();
		const resData = await transpond.send({
			method: 'post',
			path: '/login',
			params: {
				userName: data.userId,
				password: data.password,
				platform: data.platform,
			},
		});
		if (resData.result !== 0) {
			throw {
				errmsg: resData.resultNote,
				errno: resData.result,
			};
		}
		signInfo.token = (resData.detail.token || `${resData.detail.userId}/${resData.detail.mobile}`);
		think.log(`token: ${signInfo.token}`, 'LOG');
		if (this.checkVerifycode) {
			// 成功过后判断是否可以重置验证码计数
			const now = +new Date();
			const countResetTime = 1 * 3600 * 1000;
			think.log(signInfo.validateLastFail, now, countResetTime);
			if (!signInfo.validateLastFail || now - signInfo.validateLastFail > countResetTime) {
				signInfo.signFailCount = 0;
			}
		}

		think.log(`signInfo: ${JSON.stringify(signInfo)}`, 'LOG');
		await this.session('signInfo', signInfo);

		const userInfo = resData.detail;
		userInfo.token = '';
		await this.session('userInfo', userInfo);
		return resData;
	}
	async getUserInfo(data) {
		const transpond = this.getTranspond();
		const resData = await transpond.send(data);
		const userInfo = resData.detail;
		await this.session('userInfo', userInfo);
		return userInfo;
	}
	async getUserDetail(data) {
		const resData = await this.transWithLogin(data);
		const userInfo = (resData.detail && resData.detail.user) || {};
		const user = await this.session('userInfo') || {};
		userInfo.auth = (user && user.auth) || '';
		await this.session('userInfo', userInfo);
		return resData;
	}
	needLogin(data) {
		const noLogin = ['getUserDetail', 'queryRoleAuthTree', 'getRoleList']; // mock添加数据，根据实际调整
		for (let i = 0; i < noLogin.length; i += 1) {
			if (data.cmd && data.cmd.indexOf(noLogin[i]) >= 0) { // 根据rpc或者restfule调整
				return false;
			}
		}
		return true;
	}
	needOpt(data) {
		const noOpt = ['dbas', 'mos'];
		for (let i = 0; i < noOpt.length; i += 1) {
			if (data.server && data.server.indexOf(noOpt[i]) >= 0) {
				return false;
			}
		}
		return true;
	}
	async signOut(data) {
		this.useToken4Session(data);
		const signInfo = await this.session('signInfo') || {};

		if (signInfo && signInfo.token && data.secCmd !== 'clearNodeToken') {
			const transpond = this.getTranspond();
			const { token } = signInfo;

			transpond.send(data, token);
		}

		signInfo.token = '';
		await this.session('signInfo', signInfo);
		await this.session('userInfo', null);
	}
	async superTransData(data) {
		if (!think.isObject(data.params)) {
			data.params = {}; // eslint-disable-line
		}

		const signInfo = await this.session('signInfo') || {};
		try {
			this.passwordKeyList.forEach((key) => {
				data.params[key] && (data.params[key] = transPw(data.params[key], { // eslint-disable-line
					mobile: data.params.mobile,
					signInfo,
				}));
			});
		} catch (e) {
			const err = {
				errmsg: '密码解析出错',
				errno: 402,
				info: {
					msg: e.message,
					...data.params,
				},
			};
			think.log(JSON.stringify(err), 'ERROR');
			this.fail(402, '密码解析出错', err);
		}
	}
	async transData(data) {
		const {
			cmd,
		} = data;

		// 判断是否切换账号（当前账号不退出的情况）
		const userInfo = await this.session('userInfo') || {};
		if (userInfo.userId && data.userId && userInfo.userId !== data.userId) {
			think.log('登录账号切换', 'USERCHANGED');

			await this.session('userInfo', { ...userInfo, userChanged: true });

			// throw {
			// 	errmsg: '账号已切换',
			// 	errno: 406
			// };
			return this.fail(406, '账号已切换');
		}

		// 去掉多余的请求字段，如：userId
		// delete data.userId;

		// 指令下发中创建指令时，密码不做加密处理
		const superRes = this.superTransData(data) || {};

		// 特殊请求拦截
		switch (cmd) {
		case 'sendVerifyCode':
		{
			const resData = await this.sendVerifyCode(data);
			return this.success(resData);
		}
		case 'validVerifycode':
		{
			const resData = await this.validVerifycode(data);
			return this.success(resData);
		}
		default: return superRes;
		}
	}
	async transWithLogin(data, transpond = this.getTranspond(), isNeedOpt) {
		const {
			token: auth,
			csrfToken,
		} = await this.session('signInfo') || {};

		// begin 若后端响应状态码正确，后续可以考虑去掉该段逻辑
		const needLogin = this.needLogin(data);

		think.log(`transLoginInfo: needLogin:${needLogin} auth:${auth}`, 'LOG');
		if (needLogin && !auth) {
			return this.fail(401, '未登录或登录过期');
		}
		// end

		// csrf check
		if (csrfToken && (!data.csrfToken || data.csrfToken !== csrfToken)) {
			return this.capture(() => {
				throw {
					errmsg: '异常访问',
					errno: 403,
				};
			});
		}
		const { userId } = await this.session('userInfo') || {};
		const needOpt = this.needOpt(data);
		const reqData = data;
		if (needOpt) {
			reqData.params.operatorId = userId;
		}
		return this.capture(() => transpond.send(reqData, auth));
	}
	getTranspond(transpondConf = think.config('transpond.rs')) {
		const Transpond = think.service('transpond');
		const transpond = new Transpond(transpondConf);

		return transpond;
	}
}
