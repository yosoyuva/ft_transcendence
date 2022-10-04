function get_id(array: any[], id: number): any
{
	for (let i = 0; i < array.length; i++)
		if (array[i].id === id)
			return (array[i]);
	console.log("id: ", id, "not found");
	return (array[0]);
}

export default get_id;
