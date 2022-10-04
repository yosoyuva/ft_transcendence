import i_user from "../../../interface/user.interface";

import { Users } from "./user.component";

function UserListById(props: { friendsId: number[] | undefined, reqUsers: i_user[] }): JSX.Element
{
	if (!props.friendsId)
		return (<div></div>);

	let friends: i_user[] = [];

	for (let i = 0; i < props.reqUsers.length; i++)
		if (props.reqUsers[i].id && props.friendsId.includes(props.reqUsers[i].id!))
			friends.push(props.reqUsers[i]);

	return (<Users users={friends} />);
}

export default UserListById;
