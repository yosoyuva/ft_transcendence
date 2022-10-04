import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ApiUrlContext } from "../context/apiUrl.context";
import { StatusContext } from "../context/status.context";

function StatusHandler()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { socket } = useContext(StatusContext);
	const navigate = useNavigate();

	useEffect(() =>
	{
		if (socket)
		{
			socket.on('challenge', (data: any) =>
			{
				console.log("challenge", data);
				axios.get(apiUrl + "/user/" + data.senderId).then(res =>
				{
					if (window.confirm('You have been challenged by ' + res.data.name + '. Do you accept?'))
						navigate("/challenge/" + data.senderId + "/" + data.receiverId);
				}).catch(err => console.log(err));
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (<div />);
}

export default StatusHandler;
