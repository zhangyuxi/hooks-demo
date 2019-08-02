import base from '../api';

export default class extends base {
	accessByCmd = true;
	async resetPassword(data) {
		const {
			valmsg,
			params,
		} = data;

		return this.send({
			method: 'PUT',
			path: `/user/${params.mobile}/self_password`,
			params: {
				newPassword: params.newpassword,
			},
		}, `${params.mobile},${think.md5(valmsg).toUpperCase()}`); // 验证码需要大写在md5
	}
	async indexAction() {
		// 密码重置
		const data = this.post();
		const resData = await this.resetPassword(data);
		return this.success(resData);
	}
}
