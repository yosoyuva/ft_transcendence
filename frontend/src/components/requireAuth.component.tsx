import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AuthContext } from '../context/auth.context'

function RequireAuth({ children }: { children: JSX.Element }) {
	const location = useLocation()
	const { user } = useContext(AuthContext)

	if (!user) {
		return (<Navigate to='/login' state={{ path: location.pathname }} />);
	}

	return (children);
}

export default RequireAuth;