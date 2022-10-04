import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MsgDto } from './chan.dto';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('ChatGateway');

	handleConnection(client: Socket)
	{
		//console.log("[CHAN] client connect: " + client.id);
		client.on('newConnection', () =>
		{
			console.log("[CHAN] new client: " + client.id);
			this.wss.emit('newConnection', { userId: client.id });
		})
	}

	handleDisconnect(client: Socket)
	{
		console.log("[CHAN] client disconnect: " + client.id);
	}

	@SubscribeMessage('chatToServer')
	handleMessage(client: Socket, message: MsgDto)
	{
		console.log("[CHAN] received", message.username, message.msg);
		this.wss.to(message.chanId).emit('chatToClient', message);
	}

	@SubscribeMessage('joinRoom')
	handleRoomJoin(client: Socket, room: string)
	{
		client.join(room);
		client.emit('joinedRoom', room);
	}

	@SubscribeMessage('leaveRoom')
	handleRoomLeave(client: Socket, room: string)
	{
		client.leave(room);
		client.emit('leftRoom', room);
	}

	@SubscribeMessage('requestUpdate')
	handleUpdateRequest(client: Socket)
	{
		this.wss.emit('update');
	}
}
