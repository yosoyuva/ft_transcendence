import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddMatchDto
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
