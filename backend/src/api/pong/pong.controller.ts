import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { AddMatchDto } from './matchHistory.dto';
import { MatchHistory } from './matchHistory.entity';
import { PongService } from './pong.service';

@Controller('pong')
export class PongController
{
	@Inject(PongService)
	private readonly service: PongService;

	@Get('match')
	public getMatchs(): Promise<MatchHistory[]>
	{
		return this.service.getMatchs();
	}

	@Get('match/:name')
	public getMatch(@Param('name') name: string): Promise<MatchHistory[]>
	{
		return this.service.getMatchOfUser(name);
	}

	@Post('match')
	public addMatch(@Body() data: AddMatchDto): Promise<MatchHistory>
	{
		return this.service.addMatch(data);
	}
}
