import { ChangeEvent, useContext, useState } from "react";
import { Socket } from "socket.io-client";

import i_chan from "../../../interface/chan.interface";
import i_user from "../../../interface/user.interface";

import { AuthContext } from "../../../context/auth.context";

import { ReactComponent as Plus } from '../../../icon/plus-svgrepo-com.svg'

import { SearchByName } from "../../../utils/search_by_name";
import get_id from "../../../utils/get_id";

import { ReactComponent as Key } from '../../../icon/icons8-key.svg'
import { ReactComponent as Lock } from '../../../icon/lock-svgrepo-com.svg'

import Chat from "./chat.component";
import { Users } from "../user/user.component";
import Backdrop from "../../modal/backdrop";
import AddChanModal from "../../modal/chan.add.modal";
import PromptPwdModal from "../../modal/chan.prompt.pwd.modal";

function get_user_in_chan(users_id: number[] | undefined, users: i_user[]): i_user[]
{
	let ret: i_user[] = [];

	if (!users_id)
		return ([]);

	for (let i = 0; i < users.length; i++)
	{
		if (users_id[0] === -1 || (users[i].id && users_id.includes(users[i].id!)))
			ret.push(users[i]);
	}

	return (ret);
}

function get_direct_chan_name(usersId: number[], users: i_user[])
{
	let i1 = 0;
	let i2 = 0;

	if (usersId.length !== 2 || !usersId[0] || !usersId[1])
		return ("");

	for (let i = 0; i < users.length; i++)
	{
		if (users[i].id === usersId[0])
			i1 = i;
		if (users[i].id === usersId[1])
			i2 = i;
	}

	if (usersId[0] < usersId[1])
		return (users[i1].name + " ⇋ " + users[i2].name);
	return (users[i2].name + " ⇋ " + users[i1].name);
}

function Chans(props: {
	socket: Socket,
	chans: i_chan[],
	users: i_user[],
	to_chan: number,
	callback: (newId: number, oldId: number) => void,
	requestCallback: () => void
})
{
	const { user } = useContext(AuthContext);
	const [search, setSearch] = useState("");
	const selectedChan = get_id(props.chans, props.to_chan);
	const [showAddChan, setShowAddChan] = useState(false);
	const [showPromptPwd, setShowPomptPwd] = useState(false);
	const [chanPwd, setChanPwd] = useState<i_chan>(selectedChan);
	const users_in_chan: i_user[] = get_user_in_chan((selectedChan ? selectedChan.usersId : [-1]), props.users);
	const is_user_admin: boolean = (selectedChan && selectedChan.adminsId && user && user.id && selectedChan.adminsId.includes(user.id) ? true : false)
	const is_user_owner: boolean = (selectedChan && selectedChan.ownerId && user && user.id && selectedChan.ownerId === user.id ? true : false)
	let visibleChans: i_chan[] = [];

	const searchHandle = (event: ChangeEvent<HTMLInputElement>) =>
	{ setSearch(event.target.value); };

	const unp_callback = props.callback;
	const unp_users = props.users;

	function Chan(props: { obj: i_chan })
	{
		if (!props.obj.usersId || !user || !user.id)
			return (<div />);

		const is_in_chan: boolean = props.obj.usersId.includes(user.id);

		return (
			<div>
				<div className='card card--border card--btn card--chan' onClick={() =>
				{
					if (!props.obj.id || props.obj.id === selectedChan.id)
						return;
					if (props.obj.type === 'protected' && !is_in_chan)
					{
						setShowPomptPwd(true);
						setChanPwd(props.obj);
						return;
					}
					unp_callback(props.obj.id, selectedChan.id);
				}}>
					{props.obj.type === 'direct' ? (
						<span>{get_direct_chan_name(props.obj.usersId, unp_users)}</span>
					) : (
						<span>{props.obj.name}</span>
					)}
					{props.obj.type === 'protected' && <span>
						{is_in_chan ? <Key /> : <Lock />}
					</span>}
				</div>
			</div>
		);
	}

	for (let i = props.chans.length - 1; i >= 0; i--)
	{
		if ((props.chans[i].type === 'public' || props.chans[i].type === 'protected'
			|| (props.chans[i].usersId && user && user.id && props.chans[i].usersId!.includes(user.id)))
			&& (props.chans[i].bannedId && user && user.id && !props.chans[i].bannedId!.includes(user.id)))
			visibleChans.push(props.chans[i]);
	}

	function endOfForm(chan: i_chan)
	{
		setShowAddChan(false);
		props.callback((chan.id ? chan.id : 1), selectedChan.id);
	}

	function endOfPromptPwd(chan: i_chan)
	{
		if (!chan.id || !user || !user.id)
		{
			console.warn("ERROR: endOfPromptPwd unset values:", chan, user)
			return;
		}
		setShowPomptPwd(false);
		props.callback(chan.id, selectedChan.id);
	}

	return (
		<div>
			<div className='split split--chan split--left' style={{ height: "100vh", overflow: "scroll", padding: "1.5rem 0 calc(1.5rem + var(--nav-h)) 0" }}>
				<div style={{ display: "flex", flexDirection: "row" }}>
					<input className='card--input input--search' type='text' placeholder='🔍 ' onChange={searchHandle} value={search} />
					<button className='btn--plus' onClick={() => setShowAddChan(true)}>
						<Plus />
					</button>
				</div>
				<SearchByName objs={visibleChans} query={search} Constructor={Chan} />
			</div>

			<div className='split split--chan split--center'>
				{selectedChan && user && <Chat
					socket={props.socket} chan={selectedChan}
					all_users={props.users} users={users_in_chan} user={user} is_admin={is_user_admin} is_owner={is_user_owner}
					callback={props.callback} requestCallback={props.requestCallback} />}
			</div>

			<div className='split split--chan split--right' style={{ height: "calc(100vh - var(--nav-h)", overflowY: "scroll" }}>
				<Users users={users_in_chan} />
			</div >

			{(showAddChan || showPromptPwd) && <Backdrop onClick={() => { setShowAddChan(false); setShowPomptPwd(false); }} />}
			{showAddChan && user && user.id && <AddChanModal user_id={user.id} callback={endOfForm} requestCallback={props.requestCallback} />}
			{showPromptPwd && <PromptPwdModal chan_id={chanPwd.id} user_id={(user ? user.id : undefined)} callback={endOfPromptPwd} />}
		</div >
	);
}

export default Chans;
