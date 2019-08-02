import React from 'react'; // eslint-disable-line
import base from 'think-react-app/lib/base'; // eslint-disable-line
import isEnableSw from 'midway-base/lib/helper/is-enable-sw';
import api from './api';

import { Store, providesStore } from '../../../view/store';
import { ContextProvider } from '../../../view/hooks-demo/components/context';

export default class extends base(api) {
	async capture(handle) {
		try {
			return await handle();
		} catch (err) {
			if (think.isPrevent(err)) {
				throw err;
			}

			const {
				errInfo = 'ERROR',
			} = err;
			think.log(err, errInfo);
			return think.statusAction(500, this.http);
		}
	}
	async __before() {
		await super.__before();

		const signInfo = await this.session('signInfo') || {};

		if (!Object.prototype.hasOwnProperty.call(signInfo, 'signFailCount')) {
			signInfo.signFailCount = 3;
			await this.session('signInfo', signInfo);
		}
		if (!Object.prototype.hasOwnProperty.call(signInfo, 'csrfToken')) {
			signInfo.csrfToken = think.uuid();
			await this.session('signInfo', signInfo);
		}

		// const publicPem = await this.getPubKey();

		const signInfo4Clent = {
			signFailCount: signInfo.signFailCount || 0,
			csrfToken: signInfo.csrfToken,
			// publicPem,
		};

		let user = await this.session('userInfo');
		if (user) {
			user = think.extend({}, user); // 复制user, 防止在view被修改，影响session
		}

		// eslint-disable-next-line no-unused-vars
		function getRoutes(routesFile, context) {
			const userFlux = new Store('user', user);
			// signInfoFlux 无服务端渲染相关逻辑，暂时省掉

			let Provider = ContextProvider;
			Provider = providesStore(userFlux.store, Provider);

			try {
				return think.require(routesFile)({
					Provider,
					userFlux,
					signInfoFlux: {},
				});
			} catch (err) {
				think.log(err);
				return null;
			}
		}

		this.assign('time', new Date().getTime());
		this.assign('sw', isEnableSw(this.http) && this.config('sw').on);

		this.assign('user', user);
		this.assign('signInfo', signInfo4Clent);
		this.assign('getRoutes', getRoutes);
	}
	// 需要覆盖 api 的 index
	indexAction() {
		this.__call();
	}
	__call() {
		if (this.http.url.indexOf(`/${this.http.module}/${this.http.module}`) === 0) {
			return this.redirect(this.http.url.slice(this.http.module.length + 1));
		}
		return this.display();
	}
}
