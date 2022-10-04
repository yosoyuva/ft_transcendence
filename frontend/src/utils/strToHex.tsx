function hashCode(str: string)
{
	let hash = 0;
	for (var i = 0; i < str.length; i++)
	{
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
}

function intToHex(i: number)
{
	const c = (i & 0x00FFFFFF)
		.toString(16)
		.toUpperCase();

	return "00000".substring(0, 6 - c.length) + c;
}

function hexToRgb(hex: string)
{
	const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return (rgb ? {
		r: parseInt(rgb[1], 16),
		g: parseInt(rgb[2], 16),
		b: parseInt(rgb[3], 16)
	} : {
		r: 0,
		g: 0,
		b: 0
	});
}

function rgbToHex(r: number, g: number, b: number)
{
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function strToSHex(str: string)
{
	const { r, g, b } = hexToRgb(intToHex(hashCode(str)));

	return (rgbToHex(
		(r < 128 ? r + 128 : r),
		(g < 128 ? g + 128 : g),
		(b < 128 ? b + 128 : b)));
}

export default strToSHex;
