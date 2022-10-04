import axios from "axios";
import { userBacktoFront } from "./user.request";

import i_user from "../interface/user.interface";

async function asyncReqUpdateUser(url: string, type: 'put' | 'post' | 'delete', payload?: any)
{
	const update_answer = await (type === 'post' ? axios.post(url, payload)
		: (type === 'put' ? axios.put(url, payload)
			: (axios.delete(url, payload))));

	return (userBacktoFront(update_answer.data));
}

function reqUpdateUser(
	user: i_user | null,
	setUser: React.Dispatch<React.SetStateAction<i_user | null>>,
	url: string,
	type: 'put' | 'post' | 'delete',
	payload?: any)
{
	asyncReqUpdateUser(url, type, payload).then((reqUser) =>
	{ setUser(reqUser); })
}

export { reqUpdateUser, asyncReqUpdateUser };
