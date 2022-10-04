import { useContext, useState } from "react";

import { ApiUrlContext } from "../../../context/apiUrl.context";

import i_matchHistory from "../../../interface/matchHistory.interface";
import i_user from "../../../interface/user.interface";
import useFetch from "../../../request/useFetch";

import Backdrop from "../../modal/backdrop";
import ProfileModal from "../../modal/profile.modal";
import Error from "../../request_answer_component/error.component";
import Loading from "../../request_answer_component/loading.component";

function MatchHistory(props: { username: string | undefined, users: i_user[] })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(apiUrl + "/pong/match/" + props.username, 'get');

	if (!props.username)
		return (<Error msg="didn't find connected user" />);
	else if (loading)
		return (<Loading />);
	else if (error)
		return (<Error msg={error.message} />);
	else
		return (<MatchHistoryArray matches={data} username={props.username} users={props.users} />);
}

function MatchHistoryArray(props: { matches: i_matchHistory[], username: string, users: i_user[] })
{
	let ret: JSX.Element[] = [];

	for (let i = props.matches.length - 1; i >= 0; i--)
	{
		ret.push(<Match key={i} match={props.matches[i]} username={props.username}
			users={props.users} />);
	}

	return (
		<div style={{ height: "100%", width: "100%" }}>
			{ret}
		</div>
	);
}

function Match(props: { match: i_matchHistory, username: string, users: i_user[] })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const [showProfile, setShowProfile] = useState(false);

	const date = new Date(props.match.createdAt);

	const win: boolean = props.match.winner === props.username;
	const color = (win ? "#0B0" : "#B00")
	const border = "4px solid " + color;
	let opponent = -1;

	for (let i = 0; i < props.users.length; i++)
		if (props.users[i].name === (win ? props.match.loser : props.match.winner))
			opponent = i;
	if (opponent === -1)
		for (let i = 0; i < props.users.length; i++)
			if (props.users[i].id === 1)
				opponent = i;

	return (
		<div>
			<div className='card--match'
				style={{ border: border }}
				onClick={() => { setShowProfile(true) }}
			>
				<div className='card--alt--glow' style={{ margin: "0 2rem 0 1rem", fontSize: "2rem" }}>
					<span style={{ color: "#67c61a" }}>{(win ? props.match.scoreWinner : props.match.scoreLoser)}</span>
					<span>|</span>
					<span style={{ color: "red" }}>{(win ? props.match.scoreLoser : props.match.scoreWinner)}</span>
				</div>
				<div className='truncate card--alt--glow card--alt--glow'
					style={{ fontSize: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
					<div>
						<span style={{ color: "var(--color-number)" }}>{date.getDate()}</span>
						/
						<span style={{ color: "var(--color-number)" }}>{date.getMonth() + 1}</span>
						/
						<span style={{ color: "var(--color-number)" }}>{date.getFullYear()}</span>
					</div>
					<div style={{ height: "0.3rem" }} />
					<div>
						<span style={{ color: "var(--color-number)" }}>{date.getHours()}</span>
						h
						<span style={{ color: "var(--color-number)" }}>{date.getMinutes()}</span>
						m
						<span style={{ color: "var(--color-number)" }}>{date.getSeconds()}</span>
						s
					</div>
				</div>
				<div className='truncate' style={{ padding: "0.3rem 1rem 0.3rem 2rem" }}>
					<span className='card--alt--glow card--alt--glow' style={{ marginRight: "1rem" }}>{(win ? props.match.loser : props.match.winner)}</span>
					<img className='img'
						style={{ width: "3rem", height: "3rem" }}
						src={apiUrl + "/user/photo/" + props.users[opponent].id} alt="profile" />
				</div>
			</div>
			<div>
				{showProfile && <Backdrop onClick={() => { setShowProfile(false) }} />}
				{showProfile && <ProfileModal user={props.users[opponent]} onClose={() => { setShowProfile(false) }} />}
			</div>
		</div>
	);
}

export default MatchHistory;
