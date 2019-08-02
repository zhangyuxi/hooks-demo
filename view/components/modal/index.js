import React from 'react';
import Dialog from 'rc-dialog';
import classNames from 'classnames';

// import FooterButton from './FooterButton.web';

const assign = Object.assign;

export default class Modal extends React.Component < ModalProps, any > {
	static defaultProps = {
		prefixCls: 'am-modal',
		// transparent change to transparent by yiminghe
		transparent: false,
		animated: true,
		style: {},
		onShow() {},
		footer: [],
	};

	state = {
		wrapProps: {}
	};

	componentDidMount() {
		const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
		if (isIPhone) {
			this.setState({
				wrapProps: {
					onTouchStart: e => this.isInModal(e)
				}
			});
		}
	}

	isInModal(e) {
		// fix touch to scroll background page on iOS
		const prefixCls = this.props.prefixCls;
		const pNode = (node => {
			while (node.parentNode && node.parentNode !== document.body) {
				if (node.classList.contains(prefixCls)) {
					return node;
				}
				node = node.parentNode;
			}
		})(e.target);
		if (!pNode) {
			e.preventDefault();
		}
		return true;
	}

	render() {
		const {
			prefixCls,
			className,
			transparent,
			animated,
			transitionName,
			maskTransitionName,
			style,
			footer = [],
		} = this.props;
		const {
			wrapProps
		} = this.state;

		const wrapCls = classNames({
			[className]: !!className,
			[`${prefixCls}-transparent`]: transparent,
		});

		let anim = transitionName || (animated ? (transparent ? 'am-fade' : 'am-slide-up') : null);
		let maskAnim = maskTransitionName || (animated ? (transparent ? 'am-fade' : 'am-slide-up') : null);

		const btnGroupClass = `${prefixCls}-button-group-${footer.length === 2 ? 'h' : 'v'}`;
		const footerDom = /*footer.length ?
			[<div key="footer" className={btnGroupClass}>
				{footer.map((button: any, i) => <FooterButton prefixCls={prefixCls} button={button} key={i} />)}
			</div>] : */null;

		// transparent 模式下, 内容默认居中
		const rootStyle = transparent ? assign({
			width: '5.4rem',
			height: 'auto',
		}, style) : assign({
			width: '100%',
			height: '100%',
		}, style);

		const restProps = assign({}, this.props);
		['prefixCls', 'className', 'transparent', 'animated', 'transitionName', 'maskTransitionName',
			'style', 'footer', 'touchFeedback', 'wrapProps',
		].forEach(prop => {
			if (restProps.hasOwnProperty(prop)) {
				delete restProps[prop];
			}
		});

		return (
			<Dialog
        prefixCls={prefixCls}
        className={wrapCls}
        transitionName={anim}
        maskTransitionName={maskAnim}
        style={rootStyle}
        footer={footerDom}
        wrapProps={wrapProps}
        {...restProps}
      />
		);
	}
}