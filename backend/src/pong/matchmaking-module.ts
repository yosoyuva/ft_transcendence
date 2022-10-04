import { Module } from "@nestjs/common";
import { Matchmaking } from './matchmaking';

@Module({
    providers: [Matchmaking]
})

export class MatchmakingModule {}