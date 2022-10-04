import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { ApiUrlContext } from '../../context/apiUrl.context';
import { AuthContext } from '../../context/auth.context';

import i_user from '../../interface/user.interface';
import Error from '../request_answer_component/error.component';

function TwoFAModal(props: { callback: (user: i_user) => void })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { user } = useContext(AuthContext);
	const [QRLink, setQRLink] = useState<string | null>(null);
	const [secret, setSecret] = useState('');

	useEffect(() =>
	{
		if (!process.env.REACT_APP_XRAPID_API_KEY)
		{
			console.warn("rapid api key not set");
			return;
		}
		if (!user || !user.id)
			return;

		if (user.twofa && user.twofa.length > 0)
		{
			axios.put(apiUrl + "/user/" + user.id, { twofa: "remove" }).then(res =>
			{
				props.callback(res.data);
			}).catch(error => console.log(error));
			return;
		}

		const options = {
			method: 'GET',
			url: 'https://google-authenticator.p.rapidapi.com/new_v2/',
			headers: {
				'X-RapidAPI-Key': process.env.REACT_APP_XRAPID_API_KEY,
				'X-RapidAPI-Host': 'google-authenticator.p.rapidapi.com'
			}
		};

		axios.request(options).then(res =>
		{
			axios.put(apiUrl + "/user/" + user.id, { twofa: res.data }).then(r =>
			{
				setSecret(res.data);
				setQRLink('https://prore.ru/qrler.php?size=200x200&data=otpauth%3A%2F%2Ftotp%2Fft_transcendance%3Aadmin%3Fsecret%3D' + res.data + '%26issuer%3Dft_transcendance&ecc=M');
			}).catch((error) => { console.log(error); });
		}).catch(error => console.error(error));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (user && user.twofa && user.twofa.length > 0)
		return (<div />);


	function handleSubmit(e: React.FormEvent<HTMLFormElement>)
	{
		e.preventDefault();

		if (!user || !user.id)
			return;

		axios.put(apiUrl + "/user/" + user.id, { twofa: secret }).then(res =>
		{
			props.callback(res.data);
		}).catch(error => console.log(error));
	}

	return (
		<div className='backdrop'>
			<form className='modal--pick' onSubmit={handleSubmit}
				style={{ height: "70vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
				<div style={{ fontFamily: "var(--🔥-font)", fontSize: "1.2rem" }}>
					<span>please scan in your</span>
					<br />
					<span>authenticator app</span>
				</div>
				{QRLink && <img style={{ marginTop: "-5rem" }} src={QRLink} alt="qr code" />}
				<div style={{ width: "calc(100% - 6rem)" }}>
					<input className='form--submit' type='submit' value='✔' />
				</div>
			</form>
		</div>
	);
}

function TwoFAValidationModal(props: { secret: string, callback: () => void })
{
	const [twoFA, setTwoFA] = useState("");
	const [valid, setValid] = useState(true);

	function handle2FA(event: any)
	{
		event.preventDefault();
		let res = event.target.value;
		if (res === twoFA)
			res = res.slice(0, -1);
		res = res.replace(/\D/g, '').replace(/ /g, '');

		if (!process.env.REACT_APP_XRAPID_API_KEY)
		{
			console.warn("XRapid API key or secret not set");
			return;
		}

		setValid(true);
		setTwoFA(res);

		if (res.length < 6)
			return;

		const code = parseInt(res);

		const options = {
			method: 'GET',
			url: 'https://google-authenticator.p.rapidapi.com/validate/',
			params: { code: code, secret: props.secret },
			headers: {
				'X-RapidAPI-Key': process.env.REACT_APP_XRAPID_API_KEY,
				'X-RapidAPI-Host': 'google-authenticator.p.rapidapi.com'
			}
		};
		axios.request(options).then(res =>
		{
			console.log(res);
			if (res.data === "True")
				props.callback();
			else
				setValid(false);
		}).catch(err => console.log(err));

		setTwoFA("");
	}

	const value = twoFA.replace(/(.{3})/g, '$1 ');

	return (
		<form className='modal--add--chan' onSubmit={(e) => e.preventDefault()}
			style={{
				height: "40vh", width: "40vh", margin: "15vh", textAlign: "center",
				display: "flex", flexDirection: "column", justifyContent: "space-around"
			}}>
			<div style={{ margin: "-1rem 0 0 0" }}>two-factor authentication</div>
			<input className='form--input'
				style={{ width: "6rem", margin: "0 auto", padding: "0 0.5rem", fontFamily: "var(--🔥-font)", textAlign: "center" }}
				type='text' required value={value} onChange={handle2FA} />
			{!valid && <div className='ontop' style={{ position: "fixed", margin: "unset", zIndex: "-1" }}><Error msg="invalid code" /></div>}
		</form >
	);
}

export { TwoFAModal, TwoFAValidationModal };
