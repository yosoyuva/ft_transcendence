import { useEffect, useState } from "react";
import axios from "axios";

function useFetch(url: string, type: ('get' | 'post' | 'put' | 'delete'), payload?: any)
{
	const [error, setError] = useState<{ message: string } | null>(null);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<any | null>(null);

	useEffect(() =>
	{
		const answer = (type === 'get' ? axios.get(url, payload)
			: (type === 'post' ? axios.post(url, payload)
				: (type === 'put' ? axios.put(url, payload)
					: (axios.delete(url, payload)))));
		answer.then(
			(res) =>
			{
				setLoading(false);
				setData(res.data);
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) =>
			{
				setLoading(false);
				setError(error);
			}
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return ({ data, loading, error });
}

export default useFetch;
