import Loadable from 'react-loadable';
import loading from 'view/hooks-demo/components/loading';

export default Loadable({
	loader: () => import('./user.js'),
	loading,
});
