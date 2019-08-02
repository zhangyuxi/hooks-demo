import React from 'react';

const myContext = React.createContext();
const ContextProvider = props => (
	<myContext.Provider {...props}>
		{props.children}
	</myContext.Provider>
);

export { myContext, ContextProvider };
