import { createContext, Dispatch, SetStateAction } from 'react'

import i_user from '../interface/user.interface';

export const AuthContext = createContext<{
	user: i_user | null;
	setUser: Dispatch<SetStateAction<i_user | null>>;
}>({
	user: null,
	setUser: () => { }
});
