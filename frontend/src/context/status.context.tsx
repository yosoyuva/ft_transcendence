import { createContext, Dispatch, SetStateAction } from 'react'
import { Socket } from 'socket.io-client';

export const StatusContext = createContext<{
	socket: Socket | null;
	setSocket: Dispatch<SetStateAction<Socket | null>>;
}>({
	socket: null,
	setSocket: () => { }
});
