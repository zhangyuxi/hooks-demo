/* tslint:disable:max-line-length */
// inspried by https://github.com/kisenka/svg-sprite-loader/blob/master/runtime/browser-sprite.js
// Much simplified, do make sure run this after document ready
const id = '__IOT_SVG_SPRITE_NODE__';

const svgSprite = contents => `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    id="${id}"
    style="position:absolute;width:0;height:0"
  >
    <defs>
      ${contents}
    </defs>
  </svg>
`;

let icons = {};

if (typeof window !== 'undefined') {
	/* eslint-disable */
	icons = {
		'user': require('!!raw-loader!./svg/user.svg'),
		'password': require('!!raw-loader!./svg/password.svg'),
		'new-password': require('!!raw-loader!./svg/new-password.svg'),
		'confirm-password': require('!!raw-loader!./svg/confirm-password.svg'),
		'verifycode': require('!!raw-loader!./svg/verifycode.svg'),
		'capture': require('!!raw-loader!./svg/capture.svg'),
	};
	/* eslint-enable */
}

const renderSvgSprite = () => {
	const symbols = Object.keys(icons).map((iconName) => {
		const svgContent = icons[iconName].split('svg')[1];
		return `<symbol id=${iconName}${svgContent}symbol>`;
	}).join('');
	return svgSprite(symbols);
};

const loadSprite = () => {
	if (!document) {
		return;
	}
	const existing = document.getElementById(id);
	const mountNode = document.body;

	if (!existing) {
		mountNode.insertAdjacentHTML('afterbegin', renderSvgSprite());
	}
};

export default loadSprite;
