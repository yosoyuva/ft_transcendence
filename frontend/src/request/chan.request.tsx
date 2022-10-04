import { useContext } from "react";

import useFetch from "./useFetch";

import { ApiUrlContext } from "../context/apiUrl.context";

import i_chan from "../interface/chan.interface";

import Error from "../components/request_answer_component/error.component";
import Loading from "../components/request_answer_component/loading.component";
import ChanPage from "../components/page/chan/chan.page";

function chanBacktoFront(chan: any)
{
	const ret_chan: i_chan = (chan ? {
		id: chan.id,
		name: chan.name,
		usersId: chan.usersId,
		ownerId: chan.ownerId,
		adminsId: chan.adminsId,
		type: chan.type,
		msg: chan.msg,
		bannedId: chan.bannedId,
		mutedId: chan.mutedId
	} : {});

	return (ret_chan);
}

function useReqChan(query: number | string)
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(
		apiUrl + "/chan/" + (typeof query === 'number' ? query : "name/" + query), 'get');

	const reqChan: i_chan = chanBacktoFront(data);
	return ({ reqChan, loading, error });
}

function useReqChans()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(apiUrl + "/chan/", 'get');
	let reqChans: i_chan[] = [];

	if (!loading && !error && data)
		for (let i = 0; i < data.length; i++)
			reqChans.push(chanBacktoFront(data[i]));
	return ({ reqChans, loading, error });
}

function InitChan()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(apiUrl + "/chan/init", 'get');

	if (loading)
		return (<div className='back'><Loading /></div>);
	else if (error)
		return (<div className='back'><Error msg={error.message} /></div>);
	else
		return (<ChanPage />);
}

export { chanBacktoFront, useReqChan, useReqChans, InitChan }