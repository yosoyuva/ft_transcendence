	function Backdrop(props: { onClick: () => void }) {
	return <div className='backdrop' onClick={props.onClick} />;
}

export default Backdrop;