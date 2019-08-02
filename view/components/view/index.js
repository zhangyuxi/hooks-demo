import React from 'react'

export default function View(props) {
	const {children, ...rest} = props;
	return <div {...rest}>{children}</div>
}