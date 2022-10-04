import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PongController } from './pong.controller';
import { MatchHistory } from './matchHistory.entity';
import { PongService } from './pong.service';

@Module({
	imports: [TypeOrmModule.forFeature([MatchHistory])],
	controllers: [PongController],
	providers: [PongService],
})
export class PongModule { }
