import React, {
	Component,
} from 'react';//eslint-disable-line
import classnames from 'classnames';
import PropTypes from 'prop-types';//eslint-disable-line
import { Upload, Modal, Button, message, Icon as AntIcon } from 'antd';
import View from 'components/view';

import './style/index.less';

export class UploadImg extends Component {
	static propTypes = {
		imageUrl: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array,
		]),
		children: PropTypes.element,
		imgName: PropTypes.string,
		notSuit: PropTypes.bool,
		maxLength: PropTypes.number,
		handleChange: PropTypes.func,
		handleRemove: PropTypes.func,
		multiple: PropTypes.bool.isRequired,
	}
	static defaultProps = {
		imageUrl: [],
		imgName: '',
		notSuit: false,
		maxLength: 1,
		children: <React.Fragment>
			<AntIcon type="plus" />
			<div className="ant-upload-text">上传照片</div>
		</React.Fragment>,
		handleChange: () => {},
		handleRemove: () => {},
	}
	constructor(props) {
		super(props);
		let fileList;
		const { imageUrl } = props;
		if (typeof imageUrl === 'string') {
			fileList = imageUrl ? [{
				uid: -1,
				name: props.imgName,
				status: 'done',
				url: imageUrl,
				thumbUrl: imageUrl,
			}] : [];
		} else if (imageUrl instanceof Array) {
			fileList = imageUrl.map((imgUrl, index) => ({
				uid: index,
				name: '',
				status: 'done',
				url: imgUrl,
				thumbUrl: imgUrl,
			}));
		} else {
			fileList = [];
		}
		this.state = {
			hasfile: false,
			fileList,
		};
	}
	componentWillReceiveProps(nextProps) {
		// 判断图片尺寸是否超过指定尺寸，若超过则清空图片列表

		let fileList;
		const { imageUrl } = nextProps;
		if (typeof imageUrl === 'string') {
			fileList = imageUrl ? [{
				uid: -1,
				name: nextProps.imgName,
				status: 'done',
				url: imageUrl,
				thumbUrl: imageUrl,
			}] : [];
		} else if (imageUrl instanceof Array) {
			fileList = imageUrl.map((imgUrl, index) => ({
				uid: index,
				name: '',
				status: 'done',
				url: imgUrl,
				thumbUrl: imgUrl,
			}));
		} else {
			fileList = [];
		}
		this.setState({
			hasfile: false,
			fileList,
		});
	}
	handleCancel = () => this.setState({
		previewVisible: false,
	})
	async handleChange (info) { //eslint-disable-line
		const {
			maxLength,
		} = this.props;
		const fileLength = info.fileList.length;
		if (fileLength < 1) {
			return false;
		}
		const file = info.file;
		if (file.status !== 'uploading' && file.response.errno !== 0) {
			message.warn(file.response.errmsg, 3);
		}
		this.setState({ fileList: info.fileList.slice() });
		if (fileLength > maxLength) {
			message.warn(`最大上传数量为${maxLength}张`);
			return false;
		}
		if (file.status !== 'uploading') {
			this.props.handleChange &&
			typeof (this.props.handleChange) === 'function' &&
			this.props.handleChange(info.fileList);
		}
	}
	render() {
		const {
			previewVisible,
			previewImage,
			fileList,
		} = this.state;
		const cls = {
			'upload-add-disabled': !this.props.multiple && (fileList && fileList.length > 0),
		};
		const props = {
			action: G.path.uploadImg,
			listType: 'picture-card',
			defaultFileList: this.props.imageUrl ? [{
				uid: -1,
				name: this.props.imgName || '',
				status: 'done',
				url: this.props.imageUrl,
				thumbUrl: this.props.imageUrl,
			}] : [],
			onPreview: (file) => {
				this.setState({
					previewImage: file.response ? file.response.data.detail.path[0] : file.url,
					previewVisible: true,
				});
			},
			fileList: this.state.fileList,
			onChange: (info) => {
				this.handleChange(info);
			},
			onRemove: (tmp) => {
				const {
					fileList, //eslint-disable-line
				} = this.state;
				const newFileList = fileList.filter(file => file.uid !== tmp.uid);
				this.setState({
					fileList: newFileList,
					hasfile: newFileList.length > 0,
				});
				this.props.handleRemove &&
				typeof (this.props.handleRemove) === 'function' &&
				this.props.handleRemove(newFileList);
			},
			...this.props,
		};
		const maxLength = this.props.maxLength || 1;
		return (
			<View>
				<Upload {...props} className={classnames(cls)}>
					{fileList.length >= maxLength ? null : this.props.children}
				</Upload>
				<Modal
					className="img-inspect-modal"
					visible={previewVisible}
					footer={null}
					onCancel={this.handleCancel}
				>
					<img alt="pic" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</View>
		);
	}
}

export default class IotUpload extends Component {
	static propTypes = {
		action: PropTypes.string.isRequired,
		multiple: PropTypes.bool.isRequired,
		onChange: PropTypes.func,
		maxLength: PropTypes.number,
	}
	static defaultProps = {
		onChange: () => {},
		maxLength: 1,
	}
	constructor(props) {
		super(props);
		this.state = {
			hasfile: false,
		};
	}
	handleChange = (info) => { //eslint-disable-line
		const {
			maxLength,
		} = this.props;
		const fileLength = info.fileList.length;
		if (fileLength < 1) {
			return false;
		}
		let fileList = info.fileList;
		if (info.file.status === 'done' && info.file.response && info.file.response.errno === 2) {
			message.error(info.file.response.errmsg);
			fileList = [];
		}
		if (fileLength > maxLength) {
			message.warn(`最大上传数量为${maxLength}`);
			return false;
		}
		this.setState({
			hasfile: info.fileList.length > 0,
			fileList,
		});
		this.props.onChange(info);
	}
	render() {
		const cls = {
			upload: true,
			'upload-add-disabled': !this.props.multiple && this.state.hasfile,
		};
		const {
			action,
		} = this.props;

		return (<Upload
			fileList={this.state.fileList}
			className={classnames(cls)}
			action={action}
			{...this.props}
			onChange={this.handleChange}
		>
			<Button type="primary" className="upload-text-btn">
				上传附件
			</Button>
		</Upload>);
	}
}
