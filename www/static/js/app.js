import React from 'react'; // eslint-disable-line import/extensions
import { hydrate } from 'react-dom'; // eslint-disable-line import/extensions
import { BrowserRouter } from 'react-router-dom';
import { preloadReady } from 'react-loadable';

import { Message } from 'antd';
// import Toast from 'antd-mobile/lib/toast';
// import Cookie from 'tiny-cookie';
import apiInfo from 'helper/api-info';
import { Store, providesStore } from 'view/store';

import moment from 'moment';

import { ContextProvider } from 'view/hooks-demo/components/context-old';

import 'view/hooks-demo/style/main.less';
import rootRoute from 'view/hooks-demo/routes';
import 'vendor/antd/custom.less';


/* global window document performance */
window.noop = function noop() { };

apiInfo.apiUrl = G.path.api;
apiInfo.Message = {
	error(msg) {
		Message.error(msg, G.msgTime);
	},
};
window.apiInfo = apiInfo;

// 处理时间
moment.locale('zh-cn');
const time = typeof performance !== 'undefined' ? performance.timing.responseStart : new Date().getTime();
const dt = time - /* moment('2016-06-25 18:30:00')// */G.context.time;

G.context.dt = Math.abs(dt) > 1000 ? dt : 0;
moment.serverNow = function serverNow() {
	return moment() - G.context.dt;
};

// 需要放在 createElement 外面，否则每次 createElement 生成不同的 class
const Provider = ContextProvider;
const App = rootRoute({
	Provider,
	userInfo: { mobile: '' },
});

window.main = function main() {
	preloadReady().then(() => {
		hydrate(
			<BrowserRouter
				basename={G.root}
			// forceRefresh={optionalBool}
			// getUserConfirmation={optionalFunc}
			// keyLength={optionalNumber}
			>
				<App />
			</BrowserRouter>
			, document.getElementById('react-wraper'),
		);
	});
};
