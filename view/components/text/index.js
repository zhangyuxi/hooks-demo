import React from 'react'

export default function View(props) {
	const {children, ...rest} = props;
	return <span {...rest}>{children}</span>
}