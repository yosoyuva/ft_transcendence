import { useContext, useEffect } from 'react';

import './../../../style/pong.css';
import { io, Socket } from 'socket.io-client';
import { ApiUrlContext } from '../../../context/apiUrl.context';
import { useLocation } from 'react-router-dom';
import tennis from './tennis_pong.jpg';

function goodPath(path: string)
{
	path = path.replace("/view/", "");
	path = path.replaceAll("%20", " ");
	return path;
}

function PongView(props: { goBack: () => void })
{
	const { apiUrl } = useContext(ApiUrlContext);
	const socket = io(apiUrl + '/pong');
	const sampleLocation = useLocation();
	let path: string;

	path = goodPath(sampleLocation.pathname);
	const info = path.split(' ');
	useEffect(() =>
	{
		socket.emit('viewer', info[4]);
		socket.on('start-stream', () =>
		{
			viewCanvas(socket, info[0], info[2], info[5]);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<div className='pong'>
			<p className='pong--player'> <span id="p1-name"></span> vs <span id="p2-name"></span></p>
			<div id="score">
				<span id="scoreP1HTML" style={{ fontFamily: "var(--alt-font)" }} />
				-
				<span id="scoreP2HTML" style={{ fontFamily: "var(--alt-font)" }} />
			</div>
			<img id='tennis' src={tennis} alt='tennis' style={{ display: "none" }} />
			<canvas id="canvas" height="580" width="740" />
		</div >
	);
}
//<Navigate to="/play/pong" />

function viewCanvas(socket: Socket, player1: string, player2: string, type: string)
{
	let p1name = document.querySelector("#p1-name")!;
	let p2name = document.querySelector("#p2-name")!;
	let scoreP1HTML = document.querySelector("#scoreP1HTML")! as HTMLElement;
	let scoreP2HTML = document.querySelector("#scoreP2HTML")! as HTMLElement;
	let score_color = document.querySelector("#score")! as HTMLElement;
	p1name.innerHTML = player1;
	p2name.innerHTML = player2;

	const PLAYER_HEIGHT = (type === "hard" ? 50 : 100);
	const PLAYER_WIDTH = 5;
	score_color.style.color = "white";
	let canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
	let begin = 0;
	let game = {
		player: {
			y: 0
		},
		computer: {
			y: 0
		},
		ball: {
			x: 0,
			y: 0,
			r: 0,
			ratio: 0,
			speed: {
				x: 0,
				y: 0
			}
		},
		score: {
			p1_temp: 0,
			p2_temp: 0,
			p1: 0,
			p2: 0,
			ball_start: false
		}
	};

	socket.on('returnPlay', (data) =>
	{
		game = data;
		if (begin === 0)
		{
			scoreP1HTML.innerText = game.score.p1.toString();
			scoreP2HTML.innerText = game.score.p2.toString();
			begin = 1;
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
		draw();
	});

	socket.on('move-player-draw', (data) =>
	{
		game = data;
		draw();
	});



	function draw()
	{
		const path = window.location.pathname.split('/')[1];
		if (path !== "view")
			socket.close();
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
			if (path === "view")
				context.drawImage(img, 0, 0, canvas.width, canvas.height);

		}
		function drawMovingPart()
		{

			// Draw players
			// socket.emit('bdd[room].player2-go', game.player.y);
			// socket.on('bdd[room].player2-go', (data)=>{
			// 		game.computer.y = data;
			// 		console.log(data);
			// });
			context.fillStyle = (type === "hard" ? 'red' : 'white');
			context.fillRect(5, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - 5 - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.beginPath();
			context.fillStyle = (type === "hard" ? 'red' : 'white');
			context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
			context.fill();
			// Draw ball

		}
		drawMovingPart();

	}

}

export default PongView;