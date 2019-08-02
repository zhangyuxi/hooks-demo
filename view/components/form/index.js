/* eslint-disable */
import React from 'react'
import classNames from 'classnames'
import t from 'tcomb-form/lib'
import templates from './FormTemplates'
import {
	Select,
	Button,
	Message,
} from 'antd'
const {
	Option,
	OptGroup
} = Select
import Label from '../label'
import DatePicker from './datepicker'
import DateRange from './daterange'
import TreeSelect from './treeselect'
import TreeCheck from './treecheck'
import CheckBox from './checkbox'
import {
	UploadImg
} from 'components/upload';
import View from 'components/view';

import './style/index.less';
/*模板*/
templates.select = function select(locals) {
	let labelClasses, sltClasses;

	let classes = classNames({
		"form-group": true,
		"has-error": locals.hasError,
		['form-group-depth-' + locals.path.length]: true,
		['form-group-' + locals.attrs.name]: true
	});
	if (locals.config && locals.config.horizontal) {
		labelClasses = classNames({
			"control-label": true,
			['ant-col-' + locals.config.horizontal.md[0]]: locals.config.horizontal
		});
		sltClasses = classNames({
			['ant-col-' + locals.config.horizontal.md[1]]: locals.config.horizontal
		});
	} else {
		labelClasses = classNames({
			"control-label": true
		});
	}

	locals.attrs.options = locals.attrs.options || (locals.options && locals.options.length > 0 ? locals.options : null);

	let value = null;

	if (!locals.attrs.asyncOptions && locals.attrs.options) {
		value = locals.value || [];
	}
	let options = locals.options.map((item, index) => {
		let {
			children,
			...props
		} = item;
		return children ?
			<OptGroup key={index} {...props}>
				{children.map(item => <Option key={item.value} {...item}>{item.label}</Option>)}
			</OptGroup> : (t.Object.is(item) ?
				<Option key={item.value} {...item}>{item.label || item.text}</Option> :
				<Option value={item}>{item}</Option>);
	});

	return (
		<View className={classes}>
			{locals.label && <label htmlFor={locals.attrs.id} className={labelClasses}>{locals.label}</label>}
			<View className={sltClasses}>
				<Select
					ref="select"
					className="form-control"
					filterOption={(input, option) => {
						return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
					}}
					{...locals.attrs}
					onChange={(value, options) => {
						locals.onChange(value);
					}}
					value={value}>
					{options}
				</Select>
				{ locals.hasError && <span className="help-block error-block">{locals.error}</span> }
			</View>
		</View>
	);
};
templates.upload = function upload(locals) {
	let labelClasses, sltClasses;
	let classes = classNames({
		"form-group": true,
		"has-error": locals.hasError,
		['form-group-depth-' + locals.path.length]: true,
		['form-group-' + locals.attrs.name]: true
	});
	if (locals.config && locals.config.horizontal) {
		labelClasses = classNames({
			"control-label": true,
			['ant-col-' + locals.config.horizontal.md[0]]: locals.config.horizontal
		});
		sltClasses = classNames({
			['ant-col-' + locals.config.horizontal.md[1]]: locals.config.horizontal
		});
	} else {
		labelClasses = classNames({
			"control-label": true
		});
	}
	const {
		limitAllowImageTypes,
		limitSize,
		multiple,
		limitWidthAndHeight,
		id,
	} = locals.attrs;

	return <View className={classes}>
	{locals.label && <label htmlFor={id} className={labelClasses}>{locals.label}</label>}
	<View className={sltClasses}>
		<UploadImg
			imageUrl={locals.value}
			previewVisible={true}
			multiple={multiple}
			listType='picture'
			accept={limitAllowImageTypes.accepts.join(',')}
			beforeUpload= {(file) => {
				if (!limitAllowImageTypes.accepts.some(type => type === file.type)) {
					Message.error(limitAllowImageTypes.tip);
					return false;
				}
				if (file.size > limitSize.size) {
					Message.error(limitSize.tip);
					return false;
				}
				return true;
			}}
			handleRemove={() => {
				locals.onChange('');
			}}
			isSuit={(imageUrlTmp) => {
				// 判断图片尺寸
				if (imageUrlTmp) {
					const img = new window.Image();
					img.src = imageUrlTmp;
					return new Promise((resolve, reject) => {
						img.onload = () => {
							const imgWidth = parseInt(img.width, 10);
							const imgHeight = parseInt(img.height, 10);
							if(limitWidthAndHeight.isAbsoultVal){
								if (imgWidth !== limitWidthAndHeight.width || imgHeight !== limitWidthAndHeight.height) {
									Message.error(limitWidthAndHeight.tip);
									resolve(false);
								}
								return resolve(true);
							}else {
							}
						}
					});
				}
			}}
			onValueChange= {(url) => {console.log(url);locals.onChange(url)}}
		>
			<Button type="primary">选择图片</Button>
		</UploadImg>
		<View className="upload-tip">{locals.attrs.tip}</View>
		{ locals.hasError && <span className="help-block error-block">{locals.error}</span> }
	</View>
</View>;
}
templates.datepicker = DatePicker.template;
templates.daterange = DateRange.template;
templates.treeselect = TreeSelect.template;
templates.treecheck = TreeCheck.template;
templates.checkbox = CheckBox.template;
t.templates = templates;

/*类型*/
function customType(typeName, type, errMsg) {
	if (!t.Str.is(typeName)) {
		[typeName, type, errMsg] = [null, typeName, type];
	}

	type.getValidationErrorMessage = function(value, path, context) {
		let label = context.options.label;
		if (React.isValidElement(label)) {
			label = label.type === Label && typeof label.props.children === 'string' ? label.props.children : '';
		}

		if (!value) {
			return `请输入${label}`;
		} else {
			return errMsg || '验证错误';
		}
	};

	typeName && (t[typeName] = type);

	return type;
} {
	customType('RealName', t.subtype(t.Str, (s) => {
		// 由于后端数据库中1个汉字会存储为3位字符，所以需要特殊处理
		// 匹配中文字符数
		let isOk = /^[A-Za-z\u4e00-\u9fa5]{1,32}$/.test(s);
		let chineseLetterLen = s.replace(/[^\u4e00-\u9fa5]/g, '').length;

		return isOk && (s.length - chineseLetterLen + chineseLetterLen * 3) <= 32 && (s.length - chineseLetterLen + chineseLetterLen * 3) > 0;
	}), '可输入汉字和字母，不超过10个汉字或32个字符');

	customType('Phone', t.subtype(t.Str, (s) => {
		// 座机号:区号+号码，区号以0开头，3位或4位；号码由7位或8位数字组成；区号与号码之间可以无连接符，也可以“-”连接
		// let isOk = /^0\d{2,3}((-\d{7,8})|(\d{7,8}))$/.test(s);
		let isOk = /^0[1-9]\d{1,2}((-[1-9]\d{6,7})|([1-9]\d{6,7}))$/.test(s);

		return isOk;
	}), '请输入正确座机号');

	customType('Mobile', t.subtype(t.Str, (s) => {
		// 手机号：/^13[0-9]{9}$|^14[0-9]{9}$|^15[0-9]{9}$|^18[0-9]{9}$|^17[0-9]{9}$/
		let isOk = /^13[0-9]{9}$|^14[0-9]{9}$|^15[0-9]{9}$|^166[0-9]{8}$|^17[0-9]{9}$|^18[0-9]{9}$|^19[89][0-9]{8}$/.test(s);

		return isOk;
	}), '请输入正确手机号');

	customType('TEL', t.subtype(t.Str, (s) => {
		// 联系电话：由座机号或由于后端数据库中1个汉字会存储为3位字符，所以需要特殊处理
		let isPhone = /^0[1-9]\d{1,2}((-[1-9]\d{6,7})|([1-9]\d{6,7}))$/.test(s);
		let isMobile = /^13[0-9]{9}$|^14[0-9]{9}$|^15[0-9]{9}$|^18[0-9]{9}$|^17[0-9]{9}$/.test(s);

		return isPhone || isMobile;
	}), '请输入正确的手机号或座机号');

	customType('DatePicker', t.subtype(t.Str, (s) => {
		return true;
	}), 'DatePicker').getTcombFormFactory = function(options) {
		return DatePicker;
	};

	customType('DateRange', t.subtype(t.Arr, (arr) => {
		return true;
	}), 'DateRange').getTcombFormFactory = function(options) {
		return DateRange;
	};
	customType('TreeSelect', t.subtype(t.Str, (s) => {
		return true;
	}), 'TreeSelect').getTcombFormFactory = function(options) {
		return TreeSelect;
	};
	customType('TreeCheck', t.subtype(t.Arr, (s) => {
		return true;
	}), 'TreeCheck').getTcombFormFactory = function(options) {
		return TreeCheck;
	};
	customType('CheckBox', t.subtype(t.Arr, (s) => {
		return true;
	}), 'CheckBox').getTcombFormFactory = function(options) {
		return CheckBox;
	};
}

/*配置*/
t.options = {
	dealErrorState(options) {
		let fields = options.fields;
		Object.keys(fields).forEach((key) => {
			let attrs = fields[key].attrs = fields[key].attrs || {};

			attrs.onFocus = () => {
				// console.log(key)
				this.refs.form.getComponent(key).setState({
					hasError: false
				});
			};
		});
		return options;
	}
}

/*表单*/
// Object.assign(t.form.Form, {
// 	templates,
// 	i18n: {
// 		optional: '',
// 		add: '添加',
// 		remove: '删除',
// 		up: '上移',
// 		down: '下移'
// 	},
// 	auto: 'none'
// });

var tmp = {
	templates,
	i18n: {
		optional: '',
		add: '添加',
		remove: '删除',
		up: '上移',
		down: '下移'
	},
	auto: 'none'
};
for (var i in tmp) {
	if (tmp.hasOwnProperty(i)) {
		t.form.Form[i] = tmp[i];
	}
}
let Fieldset = t.form.Form;

export {
	t,
	Fieldset,
	customType
}
