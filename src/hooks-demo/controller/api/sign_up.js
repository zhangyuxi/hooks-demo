import base from '../api';

export default class extends base {
	accessByCmd = true;
	async signUp(data) {
		const {
			valmsg,
			params: {
				userType,
				...params
			},
		} = data;
		const transpond = this.getTranspond();
		return transpond.send({
			method: 'POST',
			path: '/user',
			params: {
				userType: '4', // 普通用户
				...params,
			},
		}, `${data.params.mobile},${think.md5(valmsg).toUpperCase()}`); // 验证码需要大写在md5
	}
	async indexAction() {
		const data = this.post();
		const resData = await this.signUp(data);
		return this.success(resData);
	}
}
