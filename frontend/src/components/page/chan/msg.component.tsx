import i_msg from '../../../interface/msg.interface';

import strToSHex from '../../../utils/strToHex';

function Msgs(props: { id: number | undefined, msgs: i_msg[] | undefined, mutedId: number[] | undefined, adminMutedId: number[] | undefined })
{
	if (!props.id || !props.msgs)
		return <div />

	let ret: JSX.Element[] = [];

	for (let i = 0; i < props.msgs.length; i++)
	{
		if ((!props.mutedId || !props.mutedId.includes(props.msgs[i].userId))
			&& (!props.adminMutedId || !props.adminMutedId.includes(props.msgs[i].userId)))
			ret.push(<Msg key={i} id={props.id} msg={props.msgs[i]} />);
	}

	return (
		<div className='msg--holder'>
			{ret}
		</div>
	);
}

function Msg(props: { id: number, msg: i_msg })
{
	if (props.id === props.msg.userId)
	{
		return (
			<div className='msg' style={{ marginRight: 0, marginLeft: "auto", textAlign: "right" }}>
				<span>{props.msg.msg}</span>
				<span style={{ fontWeight: "bolder" }}>{" :"}</span>
				<span className='truncate' style={{ maxWidth: "20%", color: strToSHex(props.msg.username), fontSize: "110%" }}>
					{props.msg.username}
				</span>
			</div>
		);
	}

	return (
		<div className='msg'>
			<span className='truncate' style={{ maxWidth: "20%", color: strToSHex(props.msg.username), fontSize: "110%" }}>
				{props.msg.username}
			</span>
			<span style={{ fontWeight: "bolder" }}>{": "}</span>
			<span>{props.msg.msg}</span>
		</div>
	);
}

export default Msgs;
