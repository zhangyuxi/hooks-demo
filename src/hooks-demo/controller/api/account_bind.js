import base from '../api';

export default class extends base {
	accessByCmd = true;
	async addUser(mobile, vcode) {
		const transpond = this.getTranspond();
		return transpond.send({
			method: 'post',
			path: '/user',
			params: {
				mobile,
				userName: mobile,
				password: `ls_${think.uuid(29)}`,
				realName: null,
				email: null,
				address: null,
				userType: '4',
			},
		}, think.config('transpond').rs.token).catch((err) => {
			think.log(err, 'LOG');
			throw {
				errmsg: '新增用户失败',
			};
		});
	}
	async userExist(mobile) {
		const transpond = this.getTranspond();
		return transpond.send({
			method: 'get',
			path: `/user/${mobile}`,
			params: {},
		}, think.config('transpond').rs.token).then(data => data && data.mobile).catch((err) => {
			think.log(err, 'LOG');
			throw {
				errmsg: '获取用户信息失败',
			};
		});
	}
	async accountBind(mobile, vcode, thirdLoginParams) {
		const transpond = this.getTranspond();
		return transpond.send({
			method: 'post',
			path: '/user/account/bind',
			params: {
				userName: mobile,
				verCode: vcode,
				...thirdLoginParams,
			},
		}, think.config('transpond').rs.token);
	}
	async doAuth({
		auth,
		...data
	}, signInfo) {
		auth = auth || this.auth; // eslint-disable-line no-param-reassign
		const mobile = this.mobile;

		signInfo.token = auth; // eslint-disable-line no-param-reassign

		return {
			mobile,
		};
	}
	async indexAction() {
		const signInfo = await this.session('signInfo') || {};
		const thirdLoginParams = signInfo.thirdLoginParams;
		think.log(`thirdLoginParams: ${JSON.stringify(thirdLoginParams)}`, 'LOG');

		if (!thirdLoginParams) {
			return this.fail(401, '您离开时间稍长，请重新登录');
		}

		const {
			mobile,
			vcode,
		} = this.post().params;

		return this.capture(async () => {
			if (!await this.userExist(mobile)) {
				await this.addUser(mobile, vcode);
			}

			const bindInfo = await this.accountBind(mobile, vcode, thirdLoginParams);
			this.mobile = mobile;
			this.auth = `${bindInfo.userName},${bindInfo.password}`;

			const resData = await this.signIn(this.post());

			return this.success(resData);
		});
	}
}
