import React from 'react';
import t from 'tcomb-validation'; // eslint-disable-line
import {
	decorators,
	Component,
} from 'tcomb-form/lib/components';
import classNames from 'classnames';
import { Checkbox as AntCheckbox } from 'antd';

const CheckboxGroup = AntCheckbox.Group;

function change(locals, val) {
	const value = val || '';
	locals.attrs.onChange(value);
	locals.onChange(value);
}

export function template(locals) {
	let labelClasses;
	let sltClasses;

	const classes = classNames({
		'form-group': true,
		'has-error': locals.hasError,
		[`form-group-depth-${locals.path.length}`]: true,
		[`form-group-${locals.attrs.name}`]: true,
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

	const value = locals.value || [];

	return (
		<div className={classes}>
			{locals.label && <label htmlFor={locals.attrs.id} className={labelClasses}>{locals.label}</label>}
			<div className={sltClasses}>
				<CheckboxGroup
					{...(locals.attrs || {})}
					onChange={(val) => { change(locals, val); }}
					value={value}
				/>
				{ locals.hasError && <span className="help-block error-block">{locals.error}</span> }
			</div>
		</div>
	);
}

@decorators.attrs
@decorators.template('checkbox')
export default class CheckBox extends Component {
	static template = template;

	static transformer = {
		format: value => value,
		parse: (value) => {
			const Arr = [];
			value && value.length > 0 && value.forEach((o) => {
				Arr.push(o.value);
			});
			return Arr;
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

t.form.CheckBox = CheckBox;
