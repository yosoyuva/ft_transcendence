import i_matchHistory from "./matchHistory.interface";

interface i_user
{
	id?: number;
	access_token?: string;
	twofa?: string;
	name?: string;
	pp?: Buffer;
	pp_path?: string;
	xp?: number;
	elo?: number;
	win?: number;
	lose?: number;
	matchHistory?: i_matchHistory[];
	friendsId?: number[];
	mutedId?: number[];
}

export default i_user;
