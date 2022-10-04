import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from "../../../context/auth.context";
import { StatusContext } from "../../../context/status.context";
import { ApiUrlContext } from '../../../context/apiUrl.context';

import { useReqUser } from "../../../request/user.request";
import Error from "../../request_answer_component/error.component";
import Loading from "../../request_answer_component/loading.component";
import { io, Socket } from 'socket.io-client';

function ChallengePage()
{
	const { user } = useContext(AuthContext);
	const { apiUrl } = useContext(ApiUrlContext);
	const { socket } = useContext(StatusContext);
	const senderId = useParams().senderId;
	const receiverId = useParams().receiverId;
	const senderUser = useReqUser((senderId ? parseInt(senderId) : 1));
	const receiverUser = useReqUser((receiverId ? parseInt(receiverId) : 1));
	const [inGame, setInGame] = useState(false);
	const [inPlay, setInPlay] = useState(false);
	const [gameLaunch, setGameLaunch] = useState(0);
	const [socketGame] = useState(io(apiUrl + '/pong'));
	const statusSocket = useContext(StatusContext);

	useEffect(() =>
	{
		if (socket && user && user.id && senderId && user.id === parseInt(senderId))
			socket.emit('challenge', { senderId: parseInt(senderId), receiverId: parseInt(receiverId!) });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() =>
	{
		if (!user || !user.name || !user.id || !statusSocket.socket || !senderUser.reqUser.name || !receiverUser.reqUser.name)
			return;
		handleCanvas(apiUrl, user.id, senderUser.reqUser.name, receiverUser.reqUser.name, true, "a", socketGame, statusSocket.socket, user.name);
	});

	if (!socket)
		return (<div className='ontop'><Error msg={"no socket"} /></div>);
	else if (senderUser.loading || receiverUser.loading)
		return (<div className='ontop'><Loading /></div>);
	else if (senderUser.error)
		return (<div className='ontop'><Error msg={senderUser.error.message} /></div>);
	else if (receiverUser.error)
		return (<div className='ontop'><Error msg={receiverUser.error.message} /></div>);
	else if (!senderUser.reqUser.id || !receiverUser.reqUser.id)
		return (<div className='ontop'><Error msg={"no user"} /></div>);

	return (
		<div className='pong pong--compo'>
			<div className='pong--header'>
				<p className='pong--player' style={{ color: "white" }} > <span id="p1-name">{senderUser.reqUser.name}</span> vs <span id="p2-name">{receiverUser.reqUser.name}</span></p>
			</div>
			<script src="https://cdn.socket.io/4.3.2/socket.io.min.js"></script>
			<div style={{ height: "3rem" }}>
				{!inGame &&
					<div style={{ display: "flex", justifyContent: "center" }}>
						<button className='pong--btn--play' id="lets-go" onClick={() => setInPlay(true)}>
							<span id="play-pong">play</span>
						</button>
						<br />
					</div>
				}
				<div id="score">
					<span id="scoreP1HTML" style={{ fontFamily: "var(--alt-font)" }} />
					-
					<span id="scoreP2HTML" style={{ fontFamily: "var(--alt-font)" }} />
				</div>
			</div>
			<h6 id="result" style={{ visibility: "hidden" }}> </h6>
			<canvas id="canvas" height="580" width="740" />
			{inPlay && <LaunchGame socketGame={socketGame} player1={senderUser.reqUser.name} player2={receiverUser.reqUser.name} incGameLaunch={() => { setGameLaunch(gameLaunch + 1); return gameLaunch; }} setInGame={setInGame} socket={socket} />}
		</div >
	);
}

function LaunchGame(props: {
	socketGame: Socket,
	player1: string | undefined,
	player2: string | undefined,
	incGameLaunch: () => number,
	setInGame: React.Dispatch<React.SetStateAction<boolean>>,
	socket: Socket
})
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { user } = useContext(AuthContext);
	const statusSocket = useContext(StatusContext);

	let playbtn = document.querySelector("#lets-go")! as HTMLElement;
	if (playbtn !== null)
		playbtn.style.display = "none";

	let clientRoom: string;
	useEffect(() =>
	{
		if (!props.player1 || !props.player2)
			return;
		props.socketGame.emit('challengeMatch', props.player1 + "/" + props.player2);
		props.socketGame.on('startChallenge', () =>
		{
			props.setInGame(true);
			if (!user || !user.name || !user.id || !statusSocket.socket || !props.player1 || !props.player2)
				return;
			handleCanvas(apiUrl, user.id, props.player1, props.player2, false, props.player1 + "/" + props.player2, props.socketGame, statusSocket.socket, user.name);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (<div />);
}

function handleCanvas(
	apiUrl: string,
	id: number,
	player1: string,
	player2: string,
	init: boolean,
	clientRoom: string,
	socket: Socket,
	statusSocket: Socket,
	username: string)
{
	let canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
	canvas.style.display = "block";
	canvas.style.margin = "auto";
	const PLAYER_HEIGHT = 100;
	const PLAYER_WIDTH = 5;
	let result = document.querySelector("#result")! as HTMLCanvasElement;

	let game = {
		player: {
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		computer: {
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		ball: {
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5,
			ratio: 1,
			speed: {
				x: 0.7,
				y: 0.7
			}
		},
		score: {
			p1_temp: -1,
			p2_temp: -1,
			p1: 0,
			p2: 0,
			ball_start: false
		}
	};

	let scoreP1HTML = document.querySelector("#scoreP1HTML")! as HTMLElement;
	let scoreP2HTML = document.querySelector("#scoreP2HTML")! as HTMLElement;
	let scoreP1 = 0;
	let scoreP2 = 0;

	draw();
	if (init)
		return;
	let info = {
		player: {
			height: PLAYER_HEIGHT
		},
		clientRoom: {
			name: clientRoom
		},
		who: {
			player: 0
		},
		mouseLocation: {
			coordonne: 0
		},
		canvas: {
			height: 0
		}
	};

	function Move_player(event: any)
	{
		var canvasLocation = canvas.getBoundingClientRect();
		var mouseLocation = event.clientY - canvasLocation.y;
		if (username! === player1)
		{
			info.who.player = 1;
			info.mouseLocation.coordonne = mouseLocation;
			socket.emit('movePlayer', info, mouseLocation, game, canvas.height);
		}
		else
		{
			info.who.player = 2;
			info.mouseLocation.coordonne = mouseLocation;
			socket.emit('movePlayer', info, mouseLocation, game, canvas.height);
		}
	}

	//if (username === player1)
	//	parsing_player = player2;
	//else
	//	parsing_player = player1;

	//p1name.innerHTML = player1;
	//p2name.innerHTML = player2;
	//console.log(`p1 = ${player1}, p2 = ${player2} et parsing-player = ${parsing_player}`);

	play();

	function play()
	{
		socket.emit('play', game, PLAYER_WIDTH, canvas.height, canvas.width, PLAYER_HEIGHT, "simple", clientRoom);
		socket.on('returnPlay', (data) =>
		{
			game = data;
			if (game.score.p1_temp === -1)
			{
				statusSocket.emit('updateStatus', { id: id, status: 'ingame' });
				game.score.p2_temp++;
				game.score.p1_temp++;
				scoreP1HTML.innerText = game.score.p1.toString();
				scoreP2HTML.innerText = game.score.p2.toString();
			}
			if (game.score.p1 !== game.score.p1_temp || game.score.p2 !== game.score.p2_temp)
			{
				if (game.score.p1 !== game.score.p1_temp)
				{
					game.score.p1_temp++;
					scoreP1HTML.innerText = game.score.p1.toString();
				}
				else
				{
					game.score.p2_temp++;
					scoreP2HTML.innerText = game.score.p2.toString();
				}
			}
			if (game.score.p1 >= 11 || game.score.p2 >= 11)
			{
				scoreP1 = 11;
				scoreP2 = 11;
			}
		});
		if (scoreP1 >= 11 || scoreP2 >= 11)
		{
			//socket.emit('finish', clientRoom);
			statusSocket.emit('updateStatus', { id: id, status: 'online' });
			canvas.style.display = "none";
			if ((game.score.p1 > game.score.p2 && player1 === username)
				|| (game.score.p2 > game.score.p1 && player2 === username))
				result.innerHTML = "you won !"
			else
				result.innerHTML = "you lost !"
			result.style.color = "black";
			result.style.fontSize = "6rem";
			result.style.fontFamily = "minitel";
			result.style.paddingTop = "12rem";
			result.style.visibility = "visible";

			clientRoom = '-1';
			return;
		}
		draw();
		setTimeout(play, 1000 / 200);
	}

	canvas.addEventListener('mousemove', Move_player);


	function draw()
	{
		//const img = document.querySelector("#tennis")! as HTMLImageElement;
		let context = canvas.getContext('2d')! as CanvasRenderingContext2D;

		// Draw field
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
		// Draw middle line
		context.strokeStyle = 'white';
		context.beginPath();
		context.moveTo(canvas.width / 2, 0);
		context.lineTo(canvas.width / 2, canvas.height);
		context.stroke();


		function drawMovingPart()
		{

			// Draw players
			// socket.emit('player2-go', game.player.y);
			// socket.on('player2-go', (data)=>{
			// 		game.computer.y = data;
			// 		console.log(data);
			// });

			socket.on('move-player-draw', (data) =>
			{
				game = data;
			});
			context.fillStyle = 'white'
			context.fillRect(5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - 5 - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.beginPath();
			context.fillStyle = 'white'
			context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
			context.fill();
			// Draw ball

		}
		drawMovingPart();

	}

	socket.on('disconnection', (data) =>
	{
		if (data === player1)
		{
			scoreP2HTML.innerText = "11";
			scoreP1 = 11;
			game.score.p2 = 11;
		}
		else
		{
			scoreP1HTML.innerText = "11";
			scoreP2 = 11;
			game.score.p1 = 11;
		}
	});
}


export default ChallengePage;
