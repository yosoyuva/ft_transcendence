import { Module } from '@nestjs/common';
import { ChanModule } from './chan/chan.module';
import { PongModule } from './pong/pong.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [UserModule, ChanModule, PongModule],
})
export class ApiModule { }
