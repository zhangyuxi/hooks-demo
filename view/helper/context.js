import React from 'react';
import PropTypes from 'prop-types';

export function generateWithContext(keys) {
	const contextTypes = {};
	keys.forEach((key) => {
		contextTypes[key] = PropTypes.object;
	});
	return function withContext(Component) {
		return class extends React.Component {
			static contextTypes = contextTypes;
			render() {
				const { ...props } = this.props;
				keys.forEach((key) => {
					props[key] = this.context[key];
				});
				return React.createElement(Component, props);
			}
		};
	};
}

export function generateContextProvider(keys) {
	const childContextTypes = {};
	keys.forEach((key) => {
		childContextTypes[key] = PropTypes.object;
	});
	return class ContextProvider extends React.Component {
		static childContextTypes = childContextTypes;
		getChildContext() {
			const props = {};
			keys.forEach((key) => {
				props[key] = this.props[key];
			});

			return props;
		}
		render() {
			return this.props.children;
		}
	};
}
