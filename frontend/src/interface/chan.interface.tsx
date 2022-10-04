import i_msg from "./msg.interface";

interface i_chan
{
	id?: number;
	name?: string;
	usersId?: number[];
	ownerId?: number;
	adminsId?: number[];
	type?: 'public' | 'private' | 'protected' | 'direct';
	hash?: string;
	msg?: i_msg[];
	mutedId?: number[];
	bannedId?: number[];
}

export default i_chan;
