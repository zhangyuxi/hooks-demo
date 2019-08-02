export default function getAuthList(menu, path) {
	const urls = path.split('/');
	let curList = menu;
	for (let i = 1; i < urls.length; i += 1) {
		const curmenu = curList.filter(item => item.url && item.url.split('/')[i] === urls[i]);
		if (curmenu && curmenu.length !== 0) {
			curList = curmenu[0].subMenuInfo;
		}
	}
	const authList = {};
	// eslint-disable-next-line array-callback-return
	curList.map((x) => {
		authList[x.menuName] = true;
		if (x.subMenuInfo && x.subMenuInfo.length > 0) {
			authList[x.menuName] = getAuthList(x.subMenuInfo, path);
		}
	});
	return authList;
}
