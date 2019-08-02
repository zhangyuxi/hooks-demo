import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

function noop() { }

export default withRouter(class RouteChange extends Component {
	static propTypes = {
		// match: PropTypes.object.isRequired,
		// location: PropTypes.object.isRequired,
		// history: PropTypes.object.isRequired,
		onEnter: PropTypes.func,
		onChange: PropTypes.func,
	}
	static defaultProps = {
		onEnter: noop,
		onChange: noop,
	}
	state = {
		enter: false,
	};
	componentWillMount() {
		const enterRes = this.props.onEnter(this.props);
		if (enterRes && enterRes.then) {
			Promise.resolve(enterRes).then(this.enterHandle);
		} else {
			this.enterHandle();
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.location.key !== nextProps.location.key) {
			this.props.onChange(this.props, nextProps);
		}
	}
	componentWillUnmount() {
		this.enterHandle = noop;
	}
	enterHandle = () => {
		this.setState({
			enter: true,
		});
	}
	render() {
		const { enter } = this.state;
		const { children } = this.props;

		return enter && children;
	}
});
