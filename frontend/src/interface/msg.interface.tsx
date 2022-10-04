interface i_msg
{
	userId: number;
	username: string;
	chanId?: string;
	msg: string;
	sendAt: Date;
}

export default i_msg;
