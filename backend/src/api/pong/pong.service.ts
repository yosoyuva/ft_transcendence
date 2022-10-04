import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddMatchDto } from './matchHistory.dto';
import { MatchHistory } from './matchHistory.entity';

@Injectable()
export class PongService
{
	@InjectRepository(MatchHistory)
	private readonly repositoryMatch: Repository<MatchHistory>;

	public getMatchs(): Promise<MatchHistory[]>
	{
		return this.repositoryMatch.find();
	}

	public getMatchOfUser(name: string): Promise<MatchHistory[]>
	{
		return this.repositoryMatch.find({
			where: [
				{ winner: name },
				{ loser: name },
			],
		});
	}

	public addMatch(data: AddMatchDto): Promise<MatchHistory>
	{
		const match = new MatchHistory();

		let winnerName: string;
		let loserName: string;
		let winnerScore: number;
		let loserScore: number;

		if (data.scoreP1 > data.scoreP2)
		{
			winnerName = data.P1;
			loserName = data.P2;
			winnerScore = data.scoreP1;
			loserScore = data.scoreP2;
		}
		else
		{
			winnerName = data.P2;
			loserName = data.P1;
			winnerScore = data.scoreP2;
			loserScore = data.scoreP1;
		}

		match.winner = winnerName;
		match.loser = loserName;
		match.scoreWinner = winnerScore;
		match.scoreLoser = loserScore;

		return this.repositoryMatch.save(match);
	}
}
