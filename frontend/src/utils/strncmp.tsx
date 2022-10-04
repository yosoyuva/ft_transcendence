function strncmp(str1: string, str2: string, n: number): boolean
{
	str1 = str1.substring(0, n);
	str2 = str2.substring(0, n);
	return ((str1 === str2) ? true : false);
}

export default strncmp;
