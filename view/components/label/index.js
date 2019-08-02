import React from 'react';

export default function Label(props) {
	return <span className="label-content">{props.required && <i className="required-star">*</i>}{props.children}</span>;
};
