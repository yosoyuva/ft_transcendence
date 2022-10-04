import { createContext, Dispatch, SetStateAction } from 'react'

export const ApiUrlContext = createContext<{
	apiUrl: string;
	setApiUrl: Dispatch<SetStateAction<string>>;
}>({
	apiUrl: "http://" + window.location.hostname + ":3000",
	setApiUrl: () => { }
});
