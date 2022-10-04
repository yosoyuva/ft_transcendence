function NoMatch() {
	return (
		<div style={{ backgroundColor: "#505050", display: "absolute", height: "calc(100vh - var(--nav-h))", color: "white", textAlign: "center", fontSize: "3rem", fontWeight: "bolder" }}>
			<div style={{ color: "greenyellow", fontSize: "10rem" }}>
				404
			</div>
			<div style={{ marginTop: "-1rem"}}>Page not found</div>

			<svg style={{ marginTop: "1rem" }} version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				width="900px" height="50%" viewBox="0 0 900 615" enableBackground="new 0 0 900 615" xmlSpace="preserve">
				<path fill="#EDEDED" d="M887.739,52.918c0,6.446-5.227,11.674-11.673,11.674H23.934c-6.447,0-11.673-5.228-11.673-11.674v-5.836
	c0-6.446,5.226-11.673,11.673-11.673h852.132c6.446,0,11.673,5.227,11.673,11.673V52.918z"/>
				<path fill="yellowgreen" d="M498.64,554.918c0,6.447-5.228,11.674-11.674,11.674h-73.932c-6.447,0-11.673-5.227-11.673-11.674v-5.836
	c0-6.447,5.226-11.674,11.673-11.674h73.932c6.446,0,11.674,5.227,11.674,11.674V554.918z">

					<animateTransform id="was"
						attributeName="transform"
						type="translate"
						dur="6s"
						values="400,0;-400,0;400,0"
						repeatCount="indefinite" />

				</path>

				<circle fill="yellowgreen" cx="450" cy="83" r="19">

					<animateTransform id="des"
						attributeName="transform"
						type="translate"
						dur="6s"
						values="380,440;0,0;-380,440;0,0;380,440"
						repeatCount="indefinite" />

				</circle>

			</svg>
		</div>
	);
}

export default NoMatch;