import Reflux from 'reflux';

export default class Store {
	constructor(name, info, options = {}) {
		this.actions = Reflux.createActions([
			'update',
			'sync',
		]);

		this.store = Reflux.createStore({
			listenables: this.actions,
			init(data = null, remote) {
				this.info = data;
				this.remote = remote;
			},
			onUpdate(data) {
				this.info = data;
				this.trigger(this.info);
			},
			onSync(callback, remote = this.remote) {
				if (typeof remote === 'function') {
					// eslint-disable-next-line no-param-reassign
					remote = remote(this.info);
				}

				remote && apiInfo(remote).then((data) => {
					this.info = data;
					callback && callback(data);
					this.trigger(this.info);
				});
			},
			getInitialState() {
				return this.info;
			},
		});

		this.store.name = name;
		this.store.init(info, options.remote);
	}
}
