import React, { useReducer } from 'react';

const myContext = React.createContext();

function reducer(state, action) {
	switch (action.type) {
	case 'update':
		return { userInfo: action.userInfo };
	default:
		return state;
	}
}

const ContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, { userInfo: props.userInfo });
	return (
		<myContext.Provider value={{ state, dispatch }}>
			{props.children}
		</myContext.Provider>
	);
};
export { reducer, myContext, ContextProvider };
