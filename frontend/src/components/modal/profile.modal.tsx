import { Link } from 'react-router-dom';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import axios from 'axios';

import '../../style/chan.css'

import { AuthContext } from '../../context/auth.context';
import { ApiUrlContext } from '../../context/apiUrl.context';
import { StatusContext } from '../../context/status.context';

import i_user from '../../interface/user.interface';
import i_msg from '../../interface/msg.interface';

import { ReactComponent as ProfilePage } from '../../icon/profile-user-svgrepo-com.svg';
import { ReactComponent as AddFriend } from '../../icon/add-friend-svgrepo-com.svg';
import { ReactComponent as RemoveFriend } from '../../icon/delete-unfriend-svgrepo-com.svg';
import { ReactComponent as Heart } from '../../icon/heart-friend.svg';

import UserStats from '../page/user/userstats.component';
import { asyncReqUpdateUser } from '../../request/user.update.request';

function ProfileModal(props: { user: i_user, onClose: () => void })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { socket } = useContext(StatusContext);
	const { user, setUser } = useContext(AuthContext);
	const [friend, setFriend] = useState((user && user.friendsId ? user.friendsId.includes(props.user.id!) : false));
	const [msg, setMsg] = useState("");
	const [status, setStatus] = useState("");

	const link_to_profile = "/user/" + props.user.name;

	useEffect(() =>
	{
		if (socket)
		{
			socket.emit('getStatus', { id: props.user.id, status: 'online' });

			socket.on('isStatus', (data: { id: string, status: string }) =>
				setStatus(data.status));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function updateFriend(state: boolean)
	{
		if (!user || !user.id)
			return;
		asyncReqUpdateUser(apiUrl + "/user/" + user.id, 'put',
			{ friendId: props.user.id! }).then((res) =>
			{
				setFriend(state);
				setUser(res);
			}).catch(err =>
			{
				console.log(err);
			});
	}

	function msgUpdateHandle(event: ChangeEvent<HTMLInputElement>)
	{
		setMsg(event.target.value);
	};

	function msgSendHandle(event: React.KeyboardEvent<HTMLInputElement>)
	{
		if (!props.user.id || !props.user.name || !user || !user.id || !user.name)
			return;
		if (event.key === 'Enter' && msg.length > 0)
		{
			event.preventDefault();
			const date = new Date();
			let s_msg: i_msg = {
				userId: user.id,
				username: user.name,
				msg: msg,
				sendAt: date
			}
			axios.post(apiUrl + "/chan/msg/dm/" + props.user.id, s_msg).catch(err => console.log(err));
			setMsg("");
		}
	}

	return (
		<div className='modal--profile'>
			<div className='modal--profile--top--icon'>
				<Link to={link_to_profile}>
					<ProfilePage />
				</Link>
				{user && user.name !== props.user.name &&
					<div>
						{!friend ? (
							<button onClick={() => updateFriend(true)}>
								<AddFriend />
							</button>
						) : (
							<button onClick={() => updateFriend(false)}>
								<RemoveFriend />
							</button>
						)}
					</div>
				}
			</div>
			<div>
				<img className='img' style={{ marginTop: "-3rem", height: "30vh", width: "30vh" }} src={apiUrl + "/user/photo/" + props.user.id} alt="profile" />
				{user && user.name !== props.user.name && friend
					&& <Heart className='heart' onClick={() => updateFriend(false)} />}
			</div>
			<div>
				<h2 className='truncate' style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>{props.user.name}</h2>
				<div style={{
					position: "absolute", marginTop: "-3.25rem", right: "2rem",
					color: (status === 'online' ? "#050" : status === 'offline' ? "#0004" : "#005")
				}}>
					{status}
				</div>
			</div>
			<div className='card card--alt' style={{ height: "22vh" }}>
				<UserStats user={props.user} />
			</div>
			<div>
				{user && user.name !== props.user.name &&
					<input className='card card--input' type='type' placeholder=' 💬'
						onChange={msgUpdateHandle} value={msg} onKeyDown={msgSendHandle} />}
			</div>
		</div >
	);
}

export default ProfileModal;