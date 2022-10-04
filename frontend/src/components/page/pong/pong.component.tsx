import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import './../../../style/pong.css';

import { ApiUrlContext } from '../../../context/apiUrl.context';
import { AuthContext } from '../../../context/auth.context';
import { StatusContext } from '../../../context/status.context';

import tennis from './tennis_pong.jpg'

import Error from '../../request_answer_component/error.component';

function Pong()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { user } = useContext(AuthContext);
	const statusSocket = useContext(StatusContext);
	const [inGame, setInGame] = useState(false);
	const [inPlay, setInPlay] = useState(false);
	const [gameLaunch, setGameLaunch] = useState(0);
	const [socket] = useState(io(apiUrl + '/pong'));
	const type = useParams().type;
	const navigate = useNavigate();
	useEffect(() =>
	{
		if (!user || !user.name || !user.id
			|| !type || (type !== 'simple' && type !== 'hard' && type !== 'tennis')
			|| !statusSocket || !statusSocket.socket)
			return;
		handleCanvas(apiUrl, user.id, user.name, true, type, bdd_pong, 0, socket, statusSocket.socket, "");
	});

	if (!user || !user.name)
		return (<Error msg="failed to get connected user" />);
	else if (!type || (type !== 'simple' && type !== 'hard' && type !== 'tennis'))
		return (<Error msg="failed to get type" />);

	//const p2 = (loading ? "..." : reqUser.name);

	let saloon = {
		player1: "",
		player2: "",
		clientRoom: ""
	};

	let bdd_pong: any[] = [];

	// 	props.socket.on('chatToClient', (msg: i_msg) =>
	// 	{
	// 		console.log("received at:", msg.chanId, msg);
	// 		setIcomingMsg(msg);
	// 	});

	return (
		<div className='pong pong--compo'>
			<p className='pong--player'> <span id="p1-name">{user.name}</span> vs <span id="p2-name">...</span></p>
			<button className='pong--btn--home' onClick={() => { navigate("/play"); socket.emit('kill', user.name); }}>
				<span id="goBack">home</span>
			</button>
			<div style={{ height: "3rem" }}>
				{!inGame &&
					<div style={{ display: "flex", justifyContent: "center" }}>
						<br />
						<button className='pong--btn--play' id="lets-go" onClick={() => setInPlay(true)}>
							<span id="play-pong">play</span>
						</button>
						<br />
					</div>
				}
				<p id="score" style={{ visibility: (inGame ? "visible" : "hidden") }}>
					<span id="scoreP1HTML" />-<span id="scoreP2HTML" />
				</p>
			</div>
			{type === 'tennis' && <img id='tennis' src={tennis} alt='tennis' style={{ display: "none" }} />}
			<h6 id="result" style={{ visibility: "hidden" }}> </h6>
			<canvas id="canvas" height="580" width="740" />
			{inPlay && <LaunchGame type={type} nameP1={user.name} saloon={saloon} incGameLaunch={() => { setGameLaunch(gameLaunch + 1); return gameLaunch; }} setInGame={setInGame} socket={socket} />}
		</div >
	);
}

function LaunchGame(props: {
	type: 'simple' | 'hard' | 'tennis',
	nameP1: string,
	saloon: any,
	incGameLaunch: () => number,
	setInGame: React.Dispatch<React.SetStateAction<boolean>>,
	socket: Socket
})
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { user } = useContext(AuthContext);
	const { socket } = useContext(StatusContext);

	props.socket.connect();
	let client_Room: string;
	let joueur: any;
	let playbtn = document.querySelector("#lets-go")! as HTMLElement;
	let bdd_pong: any[] = [];
	if (playbtn !== null)
		playbtn.style.display = "none";
	useEffect(() =>
	{
		if (!props.type)
			return;
		props.socket.emit('newPlayer', props.type.toString());
		props.socket.on('serverToRoom', (data: string) =>
		{
			client_Room = data;
			props.socket.emit('joinRoom', client_Room, props.nameP1, window.innerWidth / 2);
		});
		props.socket.on('switchFromServer', (data: []) =>
		{
			joueur = data!;
			props.saloon.player1 = joueur[0].toString()!;
			props.saloon.player2 = joueur[1].toString()!;
			props.saloon.clientRoom = client_Room;
			bdd_pong.push(props.saloon);
		});
		props.socket.on('start', (data) =>
		{
			props.setInGame(true);
			if (!user || !user.name || !user.id || !socket)
				return;
			handleCanvas(apiUrl, user.id, user.name, false, props.type, bdd_pong, props.incGameLaunch(), props.socket, socket, data.toString());
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (<div />);
}

window.addEventListener('popstate', () =>
{
	const socket = io('http://' + window.location.hostname + ':3000/pong');
	const path = window.location.pathname.split('/')[1];
	const JWT = JSON.parse(localStorage.getItem('user') as string);

	if (JWT && path !== 'pong' && path !== 'challenge')
		socket.emit('kill', JSON.parse(localStorage.getItem("user") as string).name);
});

function handleCanvas(
	apiUrl: string,
	id: number,
	username: string,
	init: boolean,
	type: 'simple' | 'hard' | 'tennis',
	bdd: any[] = [],
	room: number,
	socket: Socket,
	statusSocket: Socket,
	match: string)
{
	let canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
	canvas.style.display = "block";
	canvas.style.margin = "auto";
	const PLAYER_HEIGHT = (type === 'hard' ? 50 : 100);
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

	let parsing_player: string;
	let p1name = document.querySelector("#p1-name")!;
	let p2name = document.querySelector("#p2-name")!;
	let info = {
		player: {
			height: PLAYER_HEIGHT
		},
		clientRoom: {
			name: bdd[room].clientRoom
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
		// Get the mouse location in the canvas
		var canvasLocation = canvas.getBoundingClientRect();
		var mouseLocation = event.clientY - canvasLocation.y;
		if (username! === bdd[room].player1)
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

	if (username === bdd[room].player1)
		parsing_player = bdd[room].player2;
	else
		parsing_player = bdd[room].player1;

	p1name.innerHTML = bdd[room].player1;
	p2name.innerHTML = bdd[room].player2;

	if (game.score.p1 === 0)
	{
		play();
	}

	/*let deconnection1 = false;
	let deconnection2 = false;*/

	function play()
	{
		socket.emit('play', game, PLAYER_WIDTH, canvas.height, canvas.width, PLAYER_HEIGHT, type, bdd[room].clientRoom);
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
			if (game.score.p2 >= 11)
			{
				scoreP2 = 11;
			}
			if (game.score.p1 >= 11 )
			{
				scoreP1 = 11;
			}
		});
		if (scoreP1 >= 11 || scoreP2 >= 11)
		{
			socket.emit('finish', bdd[room].clientRoom, match);
			statusSocket.emit('updateStatus', { id: id, status: 'online' });
			canvas.style.display = "none";
			if (scoreP1 >= 11 && bdd[room].player1 === username)
				result.innerHTML = "you won !"
			else if (scoreP2 >= 11 && bdd[room].player2 === username)
				result.innerHTML = "you won !"
			else
				result.innerHTML = "you lost !"
			result.style.color = "black";
			result.style.fontSize = "6rem";
			result.style.fontFamily = "minitel";
			result.style.paddingTop = "12rem";
			result.style.visibility = "visible";

			postResults(apiUrl, username, game.score.p1, game.score.p2, bdd[room].player1, bdd[room].player2);
			bdd[room].clientRoom = -1;
			return;
		}
		draw();
		setTimeout(play, 1000 / 200);
	}

	canvas.addEventListener('mousemove', Move_player);

	function draw()
	{
		const img = document.querySelector("#tennis")! as HTMLImageElement;
		let context = canvas.getContext('2d')! as CanvasRenderingContext2D;
		if (type === 'simple' || type === 'hard')
		{
			// Draw field
			context.fillStyle = 'black';
			context.fillRect(0, 0, canvas.width, canvas.height);
			// Draw middle line
			context.strokeStyle = 'white';
			context.beginPath();
			context.moveTo(canvas.width / 2, 0);
			context.lineTo(canvas.width / 2, canvas.height);
			context.stroke();
		}
		else
		{
			try
			{
				if (init)
				{
					img.addEventListener('load', function ()
					{
						context.drawImage(img, 0, 0, canvas.width, canvas.height);
						drawMovingPart();
					});
				}
				else
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
			}
			catch (e)
			{
				//console.log(e);
				//window.location.href = '/youlose';
				game.score.p2 = 11;
				return;
			}
		}

		function drawMovingPart()
		{

			// Draw players
			// socket.emit('bdd[room].player2-go', game.player.y);
			// socket.on('bdd[room].player2-go', (data)=>{
			// 		game.computer.y = data;
			// 		console.log(data);
			// });

			socket.on('move-player-draw', (data) =>
			{
				game = data;
			});
			context.fillStyle = (type === 'hard' ? 'red' : 'white');
			context.fillRect(5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - 5 - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.beginPath();
			context.fillStyle = (type === 'hard' ? 'red' : 'white');
			context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
			context.fill();
			// Draw ball

		}
		drawMovingPart();

	}

	socket.on('disconnection', (data) =>
	{
		if (data === bdd[room].player1)
		{
			scoreP2HTML.innerText = "11";
			scoreP2 = 11;
			game.score.p2 = 11;
			//deconnection1 = true;
		}
		else
		{
			scoreP1HTML.innerText = "11";
			scoreP1 = 11;
			game.score.p1 = 11;
			//deconnection2 = true;
			
		}
	});
}

function postResults(apiUrl: string, username: string, scoreP1: number, scoreP2: number, player1: string, player2: string)
{
	// only the winner will post the match to the api
	if ((scoreP1 > scoreP2 && player1 === username) || (scoreP2 > scoreP1 && player2 === username))
	{

		const match_stats = {
			P1: player1,
			P2: player2,
			scoreP1: scoreP1,
			scoreP2: scoreP2
		}
		axios.post(apiUrl + "/user/match", match_stats).catch(err => console.log(err));
		axios.post(apiUrl + "/pong/match", match_stats).catch(err => console.log(err));
	}
}

export { Pong, postResults };
