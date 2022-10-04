import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateChanDto
{
	@IsString()
	@IsNotEmpty()
	public name: string;

	@IsNumber()
	@IsNotEmpty()
	public ownerId: number;

	@IsArray()
	@IsNotEmpty()
	@IsOptional()
	public usersId: number[];

	@IsString()
	@IsNotEmpty()
	public type: 'public' | 'private' | 'protected' | 'direct';

	@IsString()
	@IsOptional()
	public hash: string;
}

export class UpdateChanDto
{
	@IsString()
	@IsOptional()
	public name: string;

	@IsNumber()
	@IsOptional()
	public userId: number;

	@IsNumber()
	@IsOptional()
	public ownerId: number;

	@IsNumber()
	@IsOptional()
	public adminId: number;

	@IsString()
	@IsOptional()
	public type: 'public' | 'private' | 'protected' | 'direct';

	@IsString()
	@IsOptional()
	public hash: string;

	@IsNumber()
	@IsOptional()
	public bannedId: number;

	@IsNumber()
	@IsOptional()
	public mutedId: number;
}

export class MsgDto
{
	@IsNumber()
	@IsNotEmpty()
	public userId: number;

	@IsString()
	@IsNotEmpty()
	public username: string;

	@IsString()
	@IsOptional()
	public chanId?: string;

	@IsString()
	@IsNotEmpty()
	public msg: string;

	@IsDateString()
	@IsNotEmpty()
	public sendAt: Date;
}

export class PwdDto
{
	@IsNumber()
	@IsNotEmpty()
	public userId: number;

	@IsString()
	@IsNotEmpty()
	public pwd: string;
}
