import axios from 'axios';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import '../../../style/chan.css';
import '../../../style/user.css';

import i_user from '../../../interface/user.interface';

import { ApiUrlContext } from '../../../context/apiUrl.context';
import { AuthContext } from '../../../context/auth.context';

import { ReactComponent as Friend } from '../../../icon/friend-svgrepo-com.svg'
import { ReactComponent as Edit } from '../../../icon/write-pencil-svgrepo-com.svg'

import { useReqUsersWithDefault } from '../../../request/user.request';

import UserStats from './userstats.component';
import MatchHistory from './matchHistory.component';
import UserListById from './UserListById.component';
import NoMatch from '../nomatch.page';
import Loading from '../../request_answer_component/loading.component';
import Error from '../../request_answer_component/error.component';
import Backdrop from '../../modal/backdrop';
import UsernameChangeModal from '../../modal/username.change.modal';
import { TwoFAModal } from '../../modal/user.twofa.modal';
import LogoutButton from '../login/logout.button';

function isUserInDb(username: string, users: i_user[]): i_user | null
{
	for (let i = 0; i < users.length; i++)
		if (users[i].name === username)
			return (users[i]);
	return (null);
}

function uploadFile(apiUrl: string, user_id: number | undefined, image: File | null)
{
	if (!user_id || !image)
		return;

	const formData = new FormData();
	formData.append('file', image, image.name);

	axios.post(apiUrl + "/user/pp/" + user_id, formData).catch((err) => console.log(err));
};

function UserPage()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { user, setUser } = useContext(AuthContext);
	const { reqUsers, loading, error } = useReqUsersWithDefault();
	const [image, setImage] = useState<any | null>(null);
	const [showUsernameChangeModal, setShowUsernameChangeModal] = useState(false);
	const [userToLoad, setUserToLoad] = useState<i_user | null>(null);
	const [showTwoFA, setShowTwoFA] = useState(false);
	const p_username = useParams().username;

	if (!userToLoad)
	{
		let res: i_user | null = null;

		if (loading)
			return (<div className='back'><Loading /></div>);
		else if (error)
			return (<div className='back'><Error msg={error.message} /></div>);
		else if (p_username)
			res = isUserInDb(p_username, reqUsers);
		else
		{
			if (!user || !user.id)
				return (<NoMatch />);
			for (let i = 0; i < reqUsers.length; i++)
				if (reqUsers[i].id === user.id)
					setUserToLoad(reqUsers[i]);
		}

		if (!res)
			return (<NoMatch />);
		setUserToLoad(res);
		return (<div />);
	}

	function callback(user: i_user)
	{
		setUserToLoad(user);
		setShowUsernameChangeModal(false);
		setUser(user);
		setShowTwoFA(false)
	}

	return (
		<div className='user--page' >
			<div style={{ width: "34vw", height: "100%", display: "flex", flexDirection: "column", margin: "0 1rem 0 0" }}>
				<div className='card card--border user--page--pic--title' style={{ marginBottom: "2rem" }} >
					<div style={{ margin: "0.5rem 0 0.5rem 0" }}>
						<img className='img' style={{ height: "23vw", width: "23vw" }}
							src={(image ? URL.createObjectURL(image) : apiUrl + "/user/photo/" + userToLoad.id)} alt="profile" />
						{(!p_username || (user && p_username === user.name))
							&& <button className='twofa' onClick={() => setShowTwoFA(true)}
								style={{ color: (userToLoad && userToLoad.twofa && userToLoad.twofa.length > 0 ? "#0f0" : "#fff") }}>
								2FA
							</button>}
						{(!p_username || (user && p_username === user.name))
							&& <div className='input--file'>
								<input type='file' style={{ zIndex: "99" }} onChange={(e) =>
								{
									if (!e.target.files || !e.target.files[0] || !user || !user.id)
										return;
									if (e.target.files[0].size > 1000000)
									{
										window.alert("file too big");
										return;
									}
									if (e.target.files[0].type !== "image/jpeg"
										&& e.target.files[0].type !== "image/png"
										&& e.target.files[0].type !== "image/gif")
									{
										window.alert("image type not supported");
										return;
									}
									uploadFile(apiUrl, user.id, e.target.files[0]);
									setImage((e.target.files ? e.target.files[0] : null));
								}} />
								<Edit className='input--file--icon' />
							</div>
						}
					</div>
					<div className='user--page-title truncate'>
						<span style={{ marginLeft: "calc(1.6vw + 1rem)" }}>{userToLoad.name}</span>
						{(!p_username || (user && p_username === user.name))
							&& <button className='btn--username--change' onClick={() => setShowUsernameChangeModal(true)}>
								<Edit />
							</button>
						}
					</div>
					{(!p_username || (user && p_username === user.name))
						&& <LogoutButton icon={true} style={{ position: "absolute", top: "0.85rem", right: "0rem" }} />
					}
				</div>
				<div className='card card--alt' style={{ height: "100%" }}>
					<UserStats user={userToLoad} />
				</div>
			</div>
			<div className='card card--alt' style={{ width: "41vw", height: "100%", margin: "0 2rem 0 -0.3rem", overflowY: "scroll" }}>
				<MatchHistory username={userToLoad.name} users={reqUsers} />
			</div>
			<div style={{ width: "25vw", margin: "-1rem 0 -2rem 0", padding: "0.3rem 0 2rem 0", overflowX: "hidden" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0.7rem 1rem 0 0" }}>
					<Friend style={{ width: "3rem", height: "3rem" }} />
					<div style={{ margin: "0 1rem 0 1rem" }} />
					<span style={{ color: "#000", fontFamily: "var(--alt-font)", fontSize: "2rem" }}>
						(<span style={{ color: "var(--color-number)" }}>{(userToLoad.friendsId ? userToLoad.friendsId.length : 0)}</span>)
					</span>
				</div>
				<UserListById friendsId={userToLoad.friendsId} reqUsers={reqUsers} />
			</div>
			{(!p_username || (user && p_username === user.name)) && showUsernameChangeModal && <UsernameChangeModal callback={callback} />}
			{(!p_username || (user && p_username === user.name)) && showUsernameChangeModal && <Backdrop onClick={() => setShowUsernameChangeModal(false)} />}
			{showTwoFA && <TwoFAModal callback={callback} />}
		</div >
	);
}

export default UserPage;
