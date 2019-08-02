import React from 'react';
import t from 'tcomb-validation';
import {
	humanize,
	merge,
	getTypeInfo,
	getOptionsOfEnum,
	move,
	UIDGenerator,
	getTypeFromUnion,
	getComponentOptions,
} from 'tcomb-form/lib/util';
import {
	decorators,
	Component,
} from 'tcomb-form/lib/components';
import moment, { locales } from 'moment';

import classNames from 'classnames';
import {DatePicker as AntDatePicker} from 'antd';
import Label from '../label';

import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const Nil = t.Nil;
const assert = t.assert;
const SOURCE = 'tcomb-form';
const noobj = Object.freeze({});
const noarr = Object.freeze([]);
const noop = () => {};

function toNull(value) {
	return (t.String.is(value) && value.trim() === '') || Nil.is(value) ? null : value;
}

function change(locals, val) {
	// const format = locals.attrs.format;
	const defaultValue = locals.attrs.defaultValue;
	const format = locals.attrs.format;

	val = val ? moment(val).format(format) : moment(defaultValue).format(format);

	val && locals.attrs.onSelect && locals.attrs.onSelect(val);

	locals.onChange(val);
}
export function template(locals) {
	let labelClasses,
		sltClasses;

	const classes = classNames({
		'form-group': true,
		'has-error': locals.hasError,
		[`form-group-depth-${locals.path.length}`]: true,
	});
	if (locals.config && locals.config.horizontal) {
		labelClasses = classNames({
			'control-label': true,
			[`ant-col-${locals.config.horizontal.md[0]}`]: locals.config.horizontal,
		});
		sltClasses = classNames({
			[`ant-col-${locals.config.horizontal.md[1]}`]: locals.config.horizontal,
		});
	} else {
		labelClasses = classNames({
			'control-label': true,
		});
	}

	const value = locals.value;

	const dateValue = value ? moment(value) : moment();
	return (
		<div className={classes}>
			{locals.label && <label htmlFor={locals.attrs.id} className={labelClasses}>{locals.label}</label>}
			<div className={sltClasses}>
				<AntDatePicker
					{...(locals.attrs || {})}
					ref="datepicker"
					className="form-control"
					onChange={change.bind(this, locals)}
					value={dateValue}
				/>
				{ locals.hasError && <span className="help-block error-block">{locals.error}</span> }
			</div>
		</div>
	);
}

@decorators.attrs
@decorators.template('datepicker')
export default class DatePicker extends Component {
	static template = template;

	static transformer = {
		format: value =>
			// if (!t.Obj.is(value)) {
			// 	value = {};
			// }
			 value,

		parse: value =>
			// if (!t.Obj.is(value)) {
			// 	value = {};
			// }
			 value,

	}

	getOrder() {
		return this.props.options.order || ['M', 'D', 'YY'];
	}

	getLocals() {
		const locals = super.getLocals();
		locals.attrs = this.getAttrs();
		locals.order = this.getOrder();
		return locals;
	}
}

t.form.DatePicker = DatePicker;
