import Base from './base';

let psService;

export default class extends Base {
	async __before() { //eslint-disable-line
		const user = await this.session('userInfo');
		if (!user) {
			return this.fail(401, '未登录或登录过期');
		}
	}
	async indexAction() {
		const conf = think.parseConfig(require('midway-base/lib/helper/config').default('upload'));
		if (!psService) {
			psService = new (think.service('ps-upload'))(conf.ps_upload);
		}
		const fileCodes = this.post('fileCodes');
		psService.fetch(fileCodes).then(async (data) => {
			const buff = await data.buffer();
			const fileType = fileCodes.length > 1 ? 'application/zip' : 'image/jpeg';
			this.type(fileType);
			this.write(buff, 'utf-8');
			this.end();
		}).catch((error) => {
			this.fail(500, error.errmsg);
		});
	}
}
