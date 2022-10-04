import { useContext, useState } from 'react';
import axios from 'axios';

import { ApiUrlContext } from '../../context/apiUrl.context';

import i_chan from '../../interface/chan.interface';

import { ReactComponent as Back } from '../../icon/left-svgrepo-com.svg'

function PickPwdModal(props: {
	chan: i_chan,
	goBack: () => void,
	onClose: () => void,
	callback: (newId: number, oldId: number) => void,
	requestCallback: () => void
})
{
	const { apiUrl } = useContext(ApiUrlContext);
	const [pwd, setPwd] = useState("");
	const [choose, setChoose] = useState(true);

	function callback()
	{
		if (props.chan.id)
		{
			props.callback(props.chan.id, props.chan.id);
			props.requestCallback();
		}
		else
			console.warn("can't find chan id");
		setChoose(true);
		setPwd("");
	}

	function handleAction(type: 'remove' | 'choose')
	{
		if (type === 'remove')
			axios.delete(apiUrl + '/chan/pwd/' + props.chan.id).then(res => callback()).catch(err => console.log(err));
		else
			axios.put(apiUrl + '/chan/pwd/' + props.chan.id, { pwd: pwd, userId: 0 }).then(res => callback()).catch(err => console.log(err));
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>)
	{
		event.preventDefault();
		if (choose && pwd.length > 0)
			handleAction('choose');
		else if (!choose)
			handleAction('remove');
	}

	return (
		<div className='modal--add--chan' onMouseLeave={props.onClose}>
			<button style={{ position: "absolute", top: "1rem", left: "1rem" }} onClick={() => props.goBack()}><Back /></button>
			<span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>password</span>
			<form onSubmit={handleSubmit}>
				<div>
					<div>
						<button style={{ backgroundColor: choose === true ? "var(--alt-color-hover)" : "var(--alt-color)" }}
							type='button' onClick={() => setChoose(!choose)}>{props.chan.type === 'protected' ? "change" : "add"}</button>
						{props.chan.type === 'protected'
							&& <button style={{ backgroundColor: choose === false ? "var(--alt-color-hover)" : "var(--alt-color)" }}
								type='button' onClick={() => setChoose(false)}>remove</button>}
					</div>
					{choose && <div>
						<label>new password</label>
						<input className='form--input' type='text' required value={pwd} onChange={(e) => { setPwd(e.target.value) }} />
					</div>}
				</div>
				<div style={{ width: "calc(100% - 6rem)" }}>
					<input className='form--submit' type='submit' value='✔' />
				</div>
			</form>
		</div>
	);
}

export default PickPwdModal;
