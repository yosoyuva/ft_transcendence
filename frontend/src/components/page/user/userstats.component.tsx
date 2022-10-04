import '../../../style/user.css'

import i_user from "../../../interface/user.interface";

function UserStats(props: { user: i_user })
{
	const w = (props.user.win ? props.user.win : 0)
	const l = (props.user.lose ? props.user.lose : 0)
	const rate = ((w / (w + l) * 100).toFixed(2));
	const rate_to_print = (rate === "NaN" ? "" : rate + "%");
	const elo = (props.user.elo ? props.user.elo : 0);
	const xp = (props.user.xp ? props.user.xp : 0);
	const level = Math.floor(Math.sqrt(xp / 4.2));
	const xp_next_level = Math.ceil(Math.pow((level + 1), 2) * 4.2);
	const xp_needed = xp_next_level - xp;

	let animation_delay = 0;
	const increment = 0.5;

	return (
		<div className='parstats' style={{ fontSize: "small", marginTop: "0.5rem" }}>
			<div className='typewriter userstats card--alt--glow' style={{ animationDelay: animation_delay + "s" }}>
				<span>level:</span>
				<span style={{ color: "var(--main-color-hover)" }}>{level}</span>
			</div>
			<div className='typewriter userstats card--alt--glow' style={{ animationDelay: animation_delay + increment * 1 + "s" }}>
				<span>xp:</span>
				<span>
					<span style={{ color: "var(--main-color-hover)" }}>{xp.toFixed(2)}</span>
					<span>/</span>
					<span style={{ color: "var(--color-number)" }}>{xp_next_level}</span>
				</span>
			</div>
			<div className='typewriter userstats card--alt--glow' style={{ animationDelay: animation_delay + increment * 2 + "s" }}>
				<span>↳</span>
				<span>
					<span>(</span>
					<span style={{ color: "greenyellow" }}>+</span>
					<span style={{ color: "var(--color-number)" }}>{xp_needed.toFixed(2)}</span>
					<span>)</span>
				</span>
			</div>
			<div className='typewriter userstats card--alt--glow' style={{ animationDelay: animation_delay + increment * 3 + "s" }}>
				<span>elo:</span>
				<span style={{ color: "var(--main-color-hover)" }}>{elo}</span>
			</div>
			<div className='typewriter userstats card--alt--glow' style={{ animationDelay: animation_delay + increment * 4 + "s" }}>
				<span>winrate:</span>
				<span>
					<span style={{ color: "#67c61a" }}>{w}</span>
					<span>|</span>
					<span style={{ color: "red" }}>{l}</span>
				</span>
				<span style={{ color: "var(--color-number)" }}>{rate_to_print}</span>
			</div>
		</div>
	);
}

export default UserStats;
