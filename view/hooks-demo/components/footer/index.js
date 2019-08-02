/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import IcpLicense from 'view/hooks-demo/components/icp-license';

export default function Footer() {
	return (<IcpLicense>
		<span>Copyright ©2019 中移物联网有限公司</span>
		{/* <div className="license-a">
				<a target="_blank" rel="noopener noreferrer" href="http://www.miitbeian.gov.cn">
					渝ICP备13005647号-14
				</a>
		</div> */}
	</IcpLicense>);
}
