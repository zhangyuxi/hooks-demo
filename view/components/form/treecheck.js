import React from 'react'
import t from 'tcomb-validation'
import {
	humanize,
	merge,
	getTypeInfo,
	getOptionsOfEnum,
	move,
	UIDGenerator,
	getTypeFromUnion,
	getComponentOptions
} from 'tcomb-form/lib/util'
import {
	decorators,
	Component
} from 'tcomb-form/lib/components'
import moment from 'moment'

import classNames from 'classnames'
import AntTreeSelect from 'antd/lib/tree-select';
import Tree from 'antd/lib/tree';
const TreeNode = Tree.TreeNode;
import Label from '../label'

const Nil = t.Nil
const assert = t.assert
const SOURCE = 'tcomb-form'
const noobj = Object.freeze({})
const noarr = Object.freeze([])
const noop = () => {}

function toNull(value) {
	return (t.String.is(value) && value.trim() === '') || Nil.is(value) ? null : value
}

function change(locals, val) {
	let value = val || '';
	
	locals.onChange(value);
}

function renderNode(locals) {
	return locals.attrs.renderNode(locals.attrs.treeDataForRender);
}

export function template(locals) {
	let labelClasses, sltClasses;

	let classes = classNames({
		"form-group": true,
		"has-error": locals.hasError,
		['form-group-depth-' + locals.path.length]: true,
		['form-group-' + locals.attrs.name]: true
	});
	if(locals.config && locals.config.horizontal) {
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

	let value = locals.value || [];
	
	return (
		<div className={classes}>
			{locals.label && <label htmlFor={locals.attrs.id} className={labelClasses}>{locals.label}</label>}
			<div className={sltClasses}>
				<AntTreeSelect {...(locals.attrs || {})}
					allowClear={(locals.attrs.allowClear || true)}
					placeholder = {(locals.attrs.placeholder || '请选择')}
					dropdownMatchSelectWidth={(locals.attrs.allowClear || false)}
					treeDefaultExpandAll={(locals.attrs.allowClear || true)}
					onChange={(val) => {change(locals, val)}}
					value={value}
				>
					{locals.attrs.treeDataForRender && renderNode(locals) }
				</AntTreeSelect>
				{ locals.hasError && <span className="help-block error-block">{locals.error}</span> }
			</div>
		</div>
	);
}

@decorators.attrs
@decorators.template('treecheck')
export default class TreeCheck extends Component {

	static template = template;

	static transformer = {
		format: (value) => {
			return value;
		},
		parse: (value) => {
			let Arr = [];
			value && value.length > 0 && value.map((o) => {
				Arr.push(o.value);
			}) 
			return Arr;
		}
	}

	getOrder() {
		return this.props.options.order || ['M', 'D', 'YY']
	}

	getLocals() {
		const locals = super.getLocals()
		locals.attrs = this.getAttrs()
		locals.order = this.getOrder()
		return locals
	}
}

t.form.TreeCheck = TreeCheck;