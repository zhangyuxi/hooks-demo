import { generateWithContext, generateContextProvider } from '../../helper/context';

const keys = ['user', 'userAction', 'signInfo', 'signInfoAction'];
export const withContext = generateWithContext(keys);
export const ContextProvider = generateContextProvider(keys);
