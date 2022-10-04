interface i_matchHistory
{
	id: number;
	winner: string;
	loser: string;
	scoreWinner: number;
	scoreLoser: number;
	createdAt: Date;
}

export default i_matchHistory;
