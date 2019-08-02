import { upload } from 'midway-base/lib/controller/upload';
import api from './api';

let psService;

export default class extends upload(api) {
	async __before() { //eslint-disable-line
		const files = this.file();
		this.reqData = Object.values(files);
		const user = await this.session('userInfo');

		if (!user) {
			return this.fail(401, '未登录或登录过期');
		}
	}
	/* 
	async uploadByService(files, opt, config) {
		const conf = think.parseConfig(config);
		if (!psService) {
			psService = new (think.service('ps-upload'))(conf.ps_upload);
		}

		const defaultOpt = conf.defaultOpt;
		const newOpt = {
			...defaultOpt,
			...opt,
		};

		const fileArr = Object.values(files);
		let data = await psService.send(fileArr, newOpt);

		if (!Array.isArray(data)) {
			data.fileName = fileArr[0].originalFilename;
			data = [data];
		}

		return {
			detail: {
				path: fileArr.map(file => data.find(uploadInfo => uploadInfo.fileName === file.originalFilename).fileUrlPath),
			},
			fileInfo: data,
		};
	}
	xxxAction() {
		if (this.reqData && this.reqData.every((file) => {
			const ext = path.extname(file.originalFilename); //eslint-disable-line
			return ext === '.xxx';
		})) {
			return this.send();
		}
		return this.fail(2, '请检查上传的文件');
	}
	*/
}
