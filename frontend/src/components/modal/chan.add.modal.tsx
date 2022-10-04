import { useContext, useEffect, useState } from "react";

import useFetch from "../../request/useFetch";

import { ApiUrlContext } from "../../context/apiUrl.context";

import i_chan from "../../interface/chan.interface";


import Error from "../request_answer_component/error.component";
import Loading from "../request_answer_component/loading.component";

function SumbitAddChan(props: {
	user_id: number,
	name: string,
	type: 'public' | 'private' | 'protected',
	pwd: string,
	callback: (chan: i_chan) => void,
	requestCallback: () => void
})
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(apiUrl + "/chan", 'post', {
		name: props.name,
		ownerId: props.user_id,
		usersId: [props.user_id],
		type: props.type,
		hash: props.pwd
	})

	useEffect(() =>
	{
		if (!loading && !error)
		{
			props.callback(data);
			props.requestCallback();
		}
	}, [data, loading, error, props]);

	if (loading)
		return (<div style={{ textAlign: "center" }}><Loading /></div>);
	else if (error)
		return (<div style={{ textAlign: "center" }}><Error msg={error.message} /></div>);
	else
		return (<div />);
}

function AddChanModal(props: { user_id: number, callback: (chan: i_chan) => void, requestCallback: () => void })
{
	const [title, setTitle] = useState("");
	const [type, setType] = useState<'public' | 'private' | 'protected'>('public');
	const [pwd, setPwd] = useState("");
	const [sumbit, setSubmit] = useState(false);

	function handleSubmit(event: any)
	{
		event.preventDefault();
		setSubmit(true);
	}

	return (
		<form className='modal--add--chan' onSubmit={handleSubmit}>
			<div>
				<label>title</label>
				<input className='form--input' type='text' required value={title} onChange={(e) => { setTitle(e.target.value); setSubmit(false); }} />
			</div>
			<div>
				<button style={{ backgroundColor: type === 'public' ? "var(--alt-color-hover)" : "var(--alt-color)" }}
					type='button' onClick={() => setType('public')}>public</button>
				<button style={{ backgroundColor: type === 'private' ? "var(--alt-color-hover)" : "var(--alt-color)" }}
					type='button' onClick={() => setType('private')}>private</button>
				<button style={{ backgroundColor: type === 'protected' ? "var(--alt-color-hover)" : "var(--alt-color)" }}
					type='button' onClick={() => setType('protected')}>protected</button>
				{
					type === 'protected'
					&& <div>
						<label>password</label>
						<input className='form--input' type='text' required value={pwd} onChange={(e) => { setPwd(e.target.value) }} />
					</div>
				}
			</div>
			<div style={{ position: "absolute", top: "-4rem" }}>
				{sumbit && <SumbitAddChan user_id={props.user_id} name={title} type={type} pwd={pwd}
					callback={props.callback} requestCallback={props.requestCallback} />}
			</div>
			<div style={{ width: "calc(100% - 6rem)" }}>
				<input className='form--submit' type='submit' value='✔' />
			</div>
		</form >
	);
}

export default AddChanModal;
