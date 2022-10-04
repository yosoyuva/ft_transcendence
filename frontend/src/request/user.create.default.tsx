import axios from 'axios';
import { useContext, useState } from 'react';

import { ApiUrlContext } from '../context/apiUrl.context';

import { useReqUsers } from './user.request';

import Error from '../components/request_answer_component/error.component';
import Loading from '../components/request_answer_component/loading.component';
import Backdrop from '../components/modal/backdrop';

function CreateDefaultUser()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { reqUsers, loading, error } = useReqUsers();
	const [showError, setShowError] = useState(true);

	if (loading)
		return (<div className='ontop'><Loading /></div>);
	else if (error)
	{
		return (
			<div>
				{showError && <div className='ontop'><Error msg={error.message} /></div>}
				{showError && <Backdrop onClick={() => setShowError(false)} />}
			</div>
		);
	}
	else if (reqUsers.length > 0)
		return (<div />);

	axios.get(apiUrl + "/user/init").catch(err =>
	{
		console.log(err);
	});

	return (<div />);
}

export default CreateDefaultUser;