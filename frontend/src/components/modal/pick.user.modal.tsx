import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

import { ApiUrlContext } from "../../context/apiUrl.context";
import { AuthContext } from "../../context/auth.context";

import i_user from "../../interface/user.interface";
import i_chan from "../../interface/chan.interface";

import { ReactComponent as Undo } from '../../icon/undo-svgrepo-com.svg'
import { ReactComponent as Back } from '../../icon/left-svgrepo-com.svg'

function PickUser(props: {
	c_user: i_user, // clicked
	chan: i_chan,
	type: 'add' | 'challenge' | 'mute' | 'admin add' | 'admin ban' | 'admin mute',
	onClose: () => void,
	callback: (newId: number, oldId: number) => void,
	requestCallback: () => void
})
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { user } = useContext(AuthContext);
	const [isChallenged, setIsChallenged] = useState(false);

	if (!props.c_user.id || !props.chan.id || !user || !user.id)
		return (<div />);

	const undo = (((props.type === 'mute' && user.mutedId && user.mutedId.includes(props.c_user.id))
		|| (props.type === 'admin mute' && props.chan.mutedId && props.chan.mutedId.includes(props.c_user.id))
		|| (props.type === 'admin ban' && props.chan.bannedId && props.chan.bannedId.includes(props.c_user.id)) ? true : false));

	function ResetChallenge()
	{
		useEffect(() =>
		{
			if (!props.chan.id)
				return;

			setIsChallenged(false);
			props.onClose();
			props.callback(props.chan.id, props.chan.id);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (<div />);
	}

	async function request()
	{
		if (!props.c_user.id || !props.chan.id || !user || !user.id)
			return;

		let answer: AxiosResponse<any, any> | void;

		switch (props.type)
		{
			case 'add':
				answer = await axios.put(apiUrl + "/chan/" + props.chan.id, { userId: props.c_user.id }).catch(err => console.log(err));
				break;
			case 'challenge':
				setIsChallenged(true);
				break;
			case 'mute':
				answer = await axios.put(apiUrl + "/user/" + user.id, { mutedId: props.c_user.id }).catch(err => console.log(err));
				break;
			case 'admin add':
				answer = await axios.put(apiUrl + "/chan/" + props.chan.id, { adminId: props.c_user.id }).catch(err => console.log(err));
				break;
			case 'admin ban':
				answer = await axios.put(apiUrl + "/chan/" + props.chan.id, { bannedId: props.c_user.id }).catch(err => console.log(err));
				break;
			case 'admin mute':
				answer = await axios.put(apiUrl + "/chan/" + props.chan.id, { mutedId: props.c_user.id }).catch(err => console.log(err));
				break;
		}
		console.info("action", props.type, answer);
		if (props.type !== 'challenge' && answer)
		{
			props.onClose();
			props.callback(props.chan.id, props.chan.id);
		}
		props.requestCallback();
	}

	return (
		<div>
			<button className='pick--user' onClick={request}>
				<img className='img' style={{ height: "3rem", width: "3rem" }}
					src={apiUrl + "/user/photo/" + props.c_user.id} alt="profile" />
				<div className='truncate' style={{ color: "#fff", marginTop: "0.75rem" }}>
					{props.c_user.name}
				</div>
				{undo ? (
					<Undo style={{ height: "2rem", width: "2rem", fill: "#c00", filter: "hue-rotate(360deg) brightness(95%)", marginTop: "0.5rem" }} />
				) : (
					<div style={{ width: "2rem" }} />
				)}
			</button>
			{isChallenged && <Navigate to={"/challenge/" + user.id + "/" + props.c_user.id} />}
			{isChallenged && <ResetChallenge />}
		</div>
	);
}

function PickUsers(props: {
	users: i_user[],
	chan: i_chan,
	type: 'add' | 'challenge' | 'mute' | 'admin add' | 'admin ban' | 'admin mute',
	onClose: () => void,
	callback: (newId: number, oldId: number) => void,
	requestCallback: () => void
}): JSX.Element
{
	const { user } = useContext(AuthContext);

	if (!user)
		return (<div />);

	let ret: JSX.Element[] = [];

	for (let i = 0; i < props.users.length; i++)
		if (props.users[i].id !== user.id)
			ret.push(<PickUser key={i} c_user={props.users[i]} chan={props.chan} type={props.type}
				onClose={props.onClose} callback={props.callback} requestCallback={props.requestCallback} />);

	return (<div>{ret}</div>);
}

function PickUserModal(props: {
	users: i_user[],
	chan: i_chan,
	type: 'add' | 'challenge' | 'mute' | 'admin add' | 'admin ban' | 'admin mute',
	goBack: () => void,
	onClose: () => void,
	callback: (newId: number, oldId: number) => void,
	requestCallback: () => void
})
{
	return (
		<div onMouseLeave={props.onClose} className='modal--pick'>
			<div>
				<button style={{ position: "absolute", top: "1rem", left: "1rem" }} onClick={() => props.goBack()}><Back /></button>
				<span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>{props.type}</span>
			</div>
			<div style={{ height: "80%", marginTop: "1rem", overflowY: "scroll" }}>
				<PickUsers users={props.users} chan={props.chan} type={props.type}
					onClose={props.onClose} callback={props.callback} requestCallback={props.requestCallback} />
			</div>

		</div>
	);
}

export default PickUserModal;