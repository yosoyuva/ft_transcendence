import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import useFetch from "../../../request/useFetch";

import { ApiUrlContext } from "../../../context/apiUrl.context";
import { AuthContext } from "../../../context/auth.context";

import i_user from "../../../interface/user.interface";

import LoginPage from "./login.page";
import Loading from "../../request_answer_component/loading.component";
import Error from "../../request_answer_component/error.component";
import UsernameChangeModal from "../../modal/username.change.modal";
import { TwoFAValidationModal } from "../../modal/user.twofa.modal";

function Connect(props: { token: string, callback: (new_user: i_user, bTwoFA: boolean) => void })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(apiUrl + "/user/auth42", 'post', {
		token: props.token,
		uid: process.env.REACT_APP_UID,
		secret: process.env.REACT_APP_SECRET
	});

	useEffect(() =>
	{
		if (data)
			props.callback(data, (data.twofa && data.twofa.length > 0));
	}, [data, props]);

	if (loading)
		return (<div className='backdrop ontop'><Loading /></div>);
	else if (error)
		return (<div className='backdrop ontop'><Error msg={error.message} /></div>);

	return (<div />);
}

function ConnectPage()
{
	const { setUser } = useContext(AuthContext);
	const token = useParams().token;
	const [connected, setConnected] = useState(false);
	const [twoFA, setTwoFA] = useState<i_user | null>(null);
	const [chooseUsername, setChooseUsername] = useState(false);

	if (!token)
		return (<div className='backdrop ontop'><Error msg="token not found" /></div>);
	if (!process.env.REACT_APP_UID)
		return (<div className='backdrop ontop'><Error msg="uid not found" /></div>);
	if (!process.env.REACT_APP_SECRET)
		return (<div className='backdrop ontop'><Error msg="secret not found" /></div>);

	function connect(new_user: i_user, bTwoFA: boolean)
	{
		if (bTwoFA && new_user.twofa && new_user.twofa.length > 0)
		{
			setTwoFA(new_user);
			return;
		}

		localStorage.setItem("user", JSON.stringify(new_user));
		setUser(new_user);
		if (new_user.name && new_user.name[0] === '#')
			setChooseUsername(true);
		setConnected(true);
		setTwoFA(null);
	}

	function nameChoosen(new_user: i_user)
	{
		setUser(new_user);
		setChooseUsername(false);
	}

	return (
		<div>
			<LoginPage />
			<div className='backdrop'></div>
			{!connected && !twoFA && !chooseUsername && <Connect token={token} callback={connect} />}
			{!connected && twoFA && <TwoFAValidationModal secret={twoFA.twofa!} callback={() => connect(twoFA, false)} />}
			{connected && !twoFA && chooseUsername && <UsernameChangeModal callback={nameChoosen} />}
			{connected && !twoFA && !chooseUsername && <Navigate to='/' />}
		</div>
	);
}

export default ConnectPage;
