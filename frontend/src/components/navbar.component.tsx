import { Link } from 'react-router-dom';

import '../style/navbar.css';

import { ReactComponent as Home } from '../icon/home-seo-and-web-svgrepo-com.svg'
import { ReactComponent as Play } from '../icon/ping-pong-svgrepo-com.svg'
import { ReactComponent as Chat } from '../icon/happy-smile-svgrepo-com.svg'
import { ReactComponent as Profile } from '../icon/contact-svgrepo-com.svg'

function NavBar()
{
	return (
		<nav className='nav'>
			<Link to='/'><Home /></Link>
			<Link to='/play' className='nav--middle'><Play /></Link>
			<ul>
				<li>
					<Link to='/chan'><Chat /></Link>
				</li>
				<li>
					<Link to='/user'><Profile /></Link>
				</li>
			</ul>
		</nav>
	);
	// return (
	// 	<nav className='nav'>
	// 		<Link to='/' className="homeBut">home</Link>
	// 		<Link to='/play' className='nav--middle playBut'>play</Link>
	// 		<ul>
	// 			<li>
	// 				<Link to='/chan' className="chatBut">chat</Link>
	// 			</li>
	// 			<li>
	// 				<Link to='/user' className="profileBut">profile</Link>
	// 			</li>
	// 		</ul>
	// 	</nav>
	// );
}

export default NavBar;
