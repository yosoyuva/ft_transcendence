import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

import './style/root.css'
import './style/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import i_user from './interface/user.interface';

import { AuthContext } from './context/auth.context';
import { ApiUrlContext } from './context/apiUrl.context';
import { StatusContext } from './context/status.context';

import NavBar from './components/navbar.component';
import NoMatch from './components/page/nomatch.page';
import RequireAuth from './components/requireAuth.component';

import Home from './components/page/home.page';
import ChanPage from './components/page/chan/chan.page';
import UserPage from './components/page/user/user.page';
import PongPage from './components/page/pong/pong.page';
import CreateDefaultUser from './request/user.create.default';
import LoginPage from './components/page/login/login.page';
import ConnectPage from './components/page/login/connect.page';
import ChallengePage from './components/page/pong/challenge.page';
import PongView from './components/page/pong/pong.view';
import { Pong } from './components/page/pong/pong.component';
import StatusHandler from './components/status.handle';

function App()
{
	const [user, setUser] = useState<i_user | null>(null);
	const [apiUrl, setApiUrl] = useState("http://" + window.location.hostname + ":3000");
	const [socket, setSocket] = useState<Socket | null>(io(apiUrl + '/status'));

	const valueUser = useMemo(() => ({ user, setUser }), [user, setUser]);
	const valueApiUrl = useMemo(() => ({ apiUrl, setApiUrl }), [apiUrl, setApiUrl]);
	const valueSocket = useMemo(() => ({ socket, setSocket }), [socket, setSocket]);

	if (!user && localStorage.getItem("user"))
	{
		const JWT_user = JSON.parse(localStorage.getItem("user") as string);
		axios.get(apiUrl + "/user/" + JWT_user.id).then(res => setUser(res.data)).catch(err => console.log(err));
	}
	else if (user && socket)
		socket.emit('updateStatus', { id: user.id, status: 'online' });

	return (
		<Router>
			<ApiUrlContext.Provider value={valueApiUrl}>
				<AuthContext.Provider value={valueUser}>
					<StatusContext.Provider value={valueSocket}>
						<StatusHandler />
						<Routes>
							<Route path="/" element={<><NavBar /><Home /></>} />
							<Route path="/view/:id" element={<RequireAuth><><NavBar /><PongView goBack={() => { }} /></></RequireAuth>} />
							<Route path="/login" element={<><NavBar /><LoginPage /></>} />
							<Route path="/connect/:token" element={<><NavBar /><ConnectPage /></>} />
							<Route path="/play" element={<RequireAuth><><NavBar /><PongPage /></></RequireAuth>} />
							<Route path="/pong/:type" element={<RequireAuth><Pong /></RequireAuth>} />
							<Route path="/challenge/:senderId/:receiverId" element={<ChallengePage />} />
							<Route path="/chan" element={<RequireAuth><><NavBar /><ChanPage /></></RequireAuth>} />
							<Route path="/user" element={<RequireAuth><><NavBar /><UserPage /></></RequireAuth>} />
							<Route path="/user/:username" element={<><NavBar /><UserPage /></>} />
							<Route path="*" element={<><NavBar /><NoMatch /></>} />
						</Routes>
					</StatusContext.Provider>
				</AuthContext.Provider >
			</ApiUrlContext.Provider >
			<CreateDefaultUser />
		</Router >
	);
}

export default App;
