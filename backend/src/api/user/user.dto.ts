import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class Auth42Dto
{
	@IsString()
	@IsNotEmpty()
	public token: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	public uid?: string;

	@IsString()
	@IsNotEmpty()
	public secret: string;
}

export class UpdateUserDto
{
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	public name: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	public twofa: string;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public xp: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public elo: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public win: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public lose: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public friendId: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public mutedId: number;
}

export class UpdateUsersAfterGameDto
{
	@IsString()
	@IsNotEmpty()
	public P1: string;

	@IsString()
	@IsNotEmpty()
	public P2: string;

	@IsNumber()
	@IsNotEmpty()
	public scoreP1: number;

	@IsNumber()
	@IsNotEmpty()
	public scoreP2: number;
}

export class ChooseUsernameDto
{
	@IsString()
	@IsNotEmpty()
	public username: string;
}

export class UserStatusDto
{
	@IsNumber()
	@IsNotEmpty()
	public id: number;

	@IsString()
	public clientId?: string;

	@IsString()
	@IsNotEmpty()
	public status: ('online' | 'offline' | 'ingame');
}

export class UserChallengeDto
{
	@IsNumber()
	@IsNotEmpty()
	public senderId: number;

	@IsNumber()
	@IsNotEmpty()
	public receiverId: number;
}

export class UploadDto
{
	file?: any;
}
