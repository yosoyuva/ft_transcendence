import { useContext, useEffect, useState } from "react";

import { ApiUrlContext } from "../../../context/apiUrl.context";
import { StatusContext } from "../../../context/status.context";

import i_user from "../../../interface/user.interface";
import i_status from "../../../interface/status.interface";

import Backdrop from "../../modal/backdrop";
import ProfileModal from "../../modal/profile.modal";
import Loading from "../../request_answer_component/loading.component";

function Users(props: { users: i_user[] })
{
	const { socket } = useContext(StatusContext);
	const [status, setStatus] = useState<i_status[] | null>(null);

	let ret: JSX.Element[] = [];

	useEffect(() =>
	{
		if (socket)
		{
			socket.emit('getAllStatus');

			socket.on('isAllStatus', (data: i_status[]) =>
				setStatus(data));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!status)
		return (<Loading />);

	let index: number;
	for (let i = 0; i < props.users.length; i++)
	{
		index = -1;
		for (let x = 0; x < status.length; x++)
		{
			if (status[x].id === props.users[i].id)
			{
				index = x;
				break;
			}
		}
		if (index === -1)
			ret.push(<UserBtn key={i} user={props.users[i]} status='offline' />);
		else
			ret.push(<UserBtn key={i} user={props.users[i]} status={status[index].status} />);
	}

	return (
		<div>
			{ret}
		</div>
	);
}

function UserBtn(props: { user: i_user, status?: ('online' | 'offline' | 'ingame') })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const [showProfile, setShowProfile] = useState(false);

	function resetAllStateHandle(): void
	{
		setShowProfile(false);
	}

	return (
		<div>
			<button className='card card--border card--btn' style={{ marginLeft: "4px" }} onClick={() => { setShowProfile(true) }}>
				<img className='img img--card--user' src={apiUrl + "/user/photo/" + props.user.id} alt="profile" />
				{props.status
					&& <span style={{
						position: "absolute", bottom: "1.2rem", left: "2.4rem", width: "0.5rem", height: "0.5rem",
						fill: (props.status === 'online' ? "#0f0b" : props.status === 'offline' ? "#0000" : "#00fb")
					}}>
						<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
							<circle cx="50" cy="50" r="50" />
						</svg>
					</span>
				}
				<span className='span--card--user truncate'>{props.user.name}</span>
			</button>
			{showProfile && <Backdrop onClick={resetAllStateHandle} />}
			{showProfile && <ProfileModal user={props.user} onClose={() => { setShowProfile(false) }} />}
		</div >
	);
}

export { Users, UserBtn };
