import axios from 'axios';
import { ChangeEvent, useContext, useState } from 'react';

import { ApiUrlContext } from '../../context/apiUrl.context';
import { AuthContext } from '../../context/auth.context';

import i_user from '../../interface/user.interface';

import Error from '../request_answer_component/error.component';

function UsernameChangeModal(props: { callback: (user: i_user) => void })
{
	const { user } = useContext(AuthContext);
	const { apiUrl } = useContext(ApiUrlContext);
	const [username, setUsername] = useState("");
	const [valid, setValid] = useState(true);

	function usernameUpdateHandle(event: ChangeEvent<HTMLInputElement>)
	{
		setUsername(event.target.value);
		if (!valid)
			setValid(true);
	}

	function usernameSendHandle(event: React.KeyboardEvent<HTMLInputElement>)
	{
		if (event.key === 'Enter' && username.length > 0 && user && user.id)
		{
			event.preventDefault();
			axios.put(apiUrl + "/user/username/" + user.id, { username: username }).then((res) =>
			{
				props.callback(res.data);
			}).catch(err =>
			{
				if (err.response.status === 409)
					setValid(false);
				else
					console.log(err);
			});
			setUsername("");
		}
	}

	return (
		<div className='modal--add--chan' style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
			<div>choose a username</div>
			<input className='form--input' placeholder="..."
				onChange={usernameUpdateHandle} onKeyDown={usernameSendHandle} value={username} />
			{valid ? <div /> : <Error msg={"username already taken"} />}
			<div />
		</div>
	);
}

export default UsernameChangeModal;