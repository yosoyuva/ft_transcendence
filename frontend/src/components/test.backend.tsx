import { useContext, useEffect, useState } from "react";

import { ApiUrlContext } from "../context/apiUrl.context";

import Error from "./request_answer_component/error.component";
import Loading from "./request_answer_component/loading.component";

function TestBackend()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const [error, setError] = useState<{ message: string } | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [msg, setMsg] = useState("");

	/*console.log("window.location.hostname: " + window.location.hostname);
	console.log("apiUrl:", apiUrl);*/

	// Note: the empty deps array [] means
	// this useEffect will run once
	// similar to componentDidMount()
	useEffect(() =>
	{
		fetch(apiUrl)
			.then(response => response.json())
			.then(
				(data) =>
				{
					setIsLoaded(true);
					setMsg(data);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) =>
				{
					setIsLoaded(true);
					setError(error);
				}
			)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (error)
		return <Error msg={error.message} />;
	else if (!isLoaded)
		return <Loading />;
	else
	{
		return (
			<div>
				{msg}
				<br />
				<div>
					<div>
						loading appearance: <Loading />
					</div>
					<div>
						error appearance: <Error msg="message describing error" />
					</div>
				</div>
			</div>
		);
	}
}

export default TestBackend;