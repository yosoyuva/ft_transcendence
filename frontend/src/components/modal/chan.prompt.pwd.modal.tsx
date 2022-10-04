import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";

import { ApiUrlContext } from "../../context/apiUrl.context";

import i_chan from "../../interface/chan.interface";

import Error from "../request_answer_component/error.component";

function PromptPwdModal(props: { chan_id: number | undefined, user_id: number | undefined, callback: (chan: i_chan) => void })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const [pwd, setPwd] = useState("");
	const [wrongPwd, setWrongPwd] = useState(false);

	if (!props.chan_id || !props.user_id)
		return (<div />);

	function pwdUpdateHandle(event: ChangeEvent<HTMLInputElement>)
	{
		if (wrongPwd)
			setWrongPwd(false);
		setPwd(event.target.value);
	};

	function pwdSendHandle(event: React.KeyboardEvent<HTMLInputElement>)
	{
		if (event.key === 'Enter' && pwd.length > 0)
		{
			event.preventDefault();
			axios.post(apiUrl + "/chan/pwd/" + props.chan_id, { userId: props.user_id, pwd: pwd }).then((res) =>
			{
				if (res.data.usersId.includes(props.user_id))
					props.callback(res.data);
				else
					setWrongPwd(true);
			}).catch(err => console.log(err));
			setPwd("");
		}
	}

	return (
		<div className='modal--option'>
			<span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>password</span>
			<input className='form--input' style={{ width: "80%", alignSelf: "center" }} type='text' placeholder=' 🔑'
				onChange={pwdUpdateHandle} value={pwd} onKeyDown={pwdSendHandle} />
			{wrongPwd ? (
				<Error msg="wrong password" />
			) : (
				<div />
			)}
		</div>
	);
}

export default PromptPwdModal;
