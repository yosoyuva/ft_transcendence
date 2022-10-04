import { ReactComponent as Fire } from '../../icon/flame-danger-svgrepo-com.svg'

function Error(props: { msg: string })
{
	return (
		<div>
			<Fire style={{ height: "1.5rem", width: "1.5rem" }} />
			<span style={{ fontFamily: "var(--🔥-font)", color: "#800" }}> {props.msg} </span>
			<Fire style={{ height: "1.5rem", width: "1.5rem" }} />
		</div>
	);
}

export default Error;
