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
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import classNames from 'classnames';
import { DatePicker } from 'antd';
import Label from '../label'

const Nil = t.Nil;
const assert = t.assert;
const SOURCE = 'tcomb-form';
const noobj = Object.freeze({});
const noarr = Object.freeze([]);
const noop = () => {};

function toNull(value) {
	return (t.String.is(value) && value.trim() === '') || Nil.is(value) ? null : value;
}

function change(locals, type, val) {
	const format = locals.attrs.format;
	let defaultVal;

	if (type === 'start') {
		defaultVal = locals.attrs.start.defaultValue;
	} else {
		defaultVal = locals.attrs.end.defaultValue;
	}

	let value = locals.value;

	val = val ? moment(val).format(format) : moment(defaultVal).format(format);

	if (type === 'start') {
		value = [val, value[1] && moment(value[1]).format(format)];
	} else {
		value = [value[0] && moment(value[0]).format(format), val];
	}
	locals.onChange(value, type);
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

	const startValue = value[0] ? moment(value[0]) : null;
	const endValue = value[1] ? moment(value[1]) : null;

	return (
		<div className={classes}>
			{locals.label && <label htmlFor={locals.attrs.id} className={labelClasses}>{locals.label}</label>}
			<div className={classNames('date-range-container', sltClasses)}>
				<DatePicker
					{...(locals.attrs.start || {})}
					ref="start"
					className="form-control"
					onChange={change.bind(this, locals, 'start')}
					value={startValue}
				/>
				<span>~</span>
				<DatePicker
					{...(locals.attrs.end || {})}
					ref="end"
					className="form-control"
					onChange={change.bind(this, locals, 'end')}
					value={endValue}
				/>
				{ locals.hasError && <span className="help-block error-block">{locals.error}</span> }
			</div>
		</div>
	);
}

@decorators.attrs
@decorators.template('daterange')
export default class DateRange extends Component {

	static template = template;

	static transformer = {
		format: (value) => {
			if (!t.Arr.is(value)) {
				value = [];
			}
			return value;
		},
		parse: (value) => {
			if (!t.Arr.is(value)) {
				value = [];
			}
			return value;
		},
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

t.form.DateRange = DateRange;
