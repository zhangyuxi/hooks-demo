import React from 'react';
import PropTypes from 'prop-types';

export default function providesStore(propName, Component) {
	if (arguments.length < 2) return providesStore.bind(null, propName);

	let store;

	if (typeof propName !== 'string') {
		store = propName;
		propName = store.name; // eslint-disable-line no-param-reassign
	}

	const storeName = `${propName}Store`;

	return class StoreProvider extends React.Component {
		static contextTypes = {
			[storeName]: PropTypes.object,
		};
		constructor(props, context) {
			super(props, context);

			this.store = store || context[storeName];

			this.state = {
				storeState: this.store.getInitialState ? this.store.getInitialState() : undefined,
			};
		}
		componentDidMount() {
			this.unsubscribe = this.store.listen((storeState) => {
				this.setState({ storeState });
			});
		}
		componentWillUnmount() {
			this.unsubscribe();
		}
		render() {
			return (
				<Component
					{...this.props}
					{...{ [propName]: this.state.storeState }}
				/>
			);
		}
	};
}
