import React from 'react';
import Loadable from 'react-loadable';
import loading from 'view/hooks-demo/components/loading';


export default class extends React.Component {
	componentDidMount() {
		this.Page = Loadable.Map({
			loader: {
				page: () => import('./usememo'),
			},
			loading,
			render(loaded, props) {
				const Usememo = loaded.page.default;
				return <Usememo {...props} />;
			},
		});
		this.forceUpdate();
	}

	Page = () => null;
	render() {
		const { Page } = this;
		return <Page {...this.props} />;
	}
}
