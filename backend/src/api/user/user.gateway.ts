import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserChallengeDto, UserStatusDto } from './user.dto';

@WebSocketGateway({ namespace: '/status', cors: { origin: '*' } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('UserGateway');
	private db: UserStatusDto[] = [];

	handleConnection(client: Socket)
	{
		//console.log("[STATUS] client connected: " + client.id);
	}

	handleDisconnect(client: Socket)
	{
		//console.log("[STATUS] client disconnected: " + client.id);

		for (let i = 0; i < this.db.length; i++)
		{
			if (this.db[i].clientId === client.id)
			{
				this.db.splice(i, 1);
				break;
			}
		}

		//this.wss.emit('disconnect', { userId: client.id });
	}

	@SubscribeMessage('updateStatus')
	handleUpdateStatus(client: Socket, status: UserStatusDto)
	{
		//console.log("[STATUS] update", status.id, status.status);

		let index = -1;
		for (let i = 0; i < this.db.length; i++)
		{
			if (this.db[i].id === status.id)
			{
				index = i;
				break;
			}
		}
		if (index === -1)
		{
			status.clientId = client.id;
			this.db.push(status);
		}
		else
		{
			this.db[index] = status;
			this.db[index].clientId = client.id;
		}

		this.wss.emit('receivedStatus', status);
	}

	@SubscribeMessage('getStatus')
	handleGetStatus(client: Socket, status: UserStatusDto)
	{
		//console.log("[STATUS] get", status.id);

		let index = -1;
		for (let i = 0; i < this.db.length; i++)
		{
			if (this.db[i].id === status.id)
			{
				index = i;
				break;
			}
		}
		if (index === -1)
			client.emit('isStatus', { id: status.id, status: 'offline' });
		else
			client.emit('isStatus', { id: status.id, status: this.db[index].status });
	}

	@SubscribeMessage('getAllStatus')
	handleGetAllStatus(client: Socket)
	{
		//console.log("[STATUS] get all");
		client.emit('isAllStatus', this.db);
	}


	@SubscribeMessage('challenge')
	handleChallenge(client: Socket, status: UserChallengeDto)
	{
		//console.log("[STATUS] challenge", status.senderId, "->", status.receiverId);

		let index = -1;

		for (let i = 0; i < this.db.length; i++)
		{
			//console.log(i, "this.db[i]", this.db[i]);
			//console.log(this.db[i].id, status.receiverId);
			if (this.db[i].id === status.receiverId)
			{
				index = i;
				break;
			}
		}
		if (index > -1 && this.db[index].status !== 'offline')
		{
			//console.log("[STATUS] challenge sent to", this.db[index].id);
			client.to(this.db[index].clientId).emit('challenge', status);
		}
		else
		{
			//console.log("[STATUS] challenge failed");
			//console.table(this.db);
		}
	}
}
