import strncmp from "./strncmp";

import i_user from "../interface/user.interface";
import i_chan from "../interface/chan.interface";

function SearchByName(props: { objs: i_user[] | i_chan[], query: string, Constructor: (props: { obj: i_user | i_chan }) => JSX.Element })
{
	let ret: JSX.Element[] = [];

	for (let i = props.objs.length - 1; i >= 0; i--)
	{
		if (props.query.length === 0 || strncmp(props.query, props.objs[i].name!, props.query.length))
			ret.push(<props.Constructor key={i} obj={props.objs[i]} />);
	}

	return (
		<div>
			{ret}
		</div>
	);
}

function SearchByExactName(props: { objs: i_user[] | i_chan[], query: string, Constructor: (props: { obj: i_user | i_chan }) => JSX.Element })
{
	let ret: JSX.Element[] = [];

	for (let i = props.objs.length - 1; i >= 0; i--)
	{
		if (props.objs[i].name === props.query)
			ret.push(<props.Constructor key={i} obj={props.objs[i]} />);
	}

	return (
		<div>
			{ret}
		</div>
	);
}

export { SearchByName, SearchByExactName };
