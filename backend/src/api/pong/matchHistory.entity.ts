import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class MatchHistory
{
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({ type: 'varchar', length: 255 })
	public winner: string;

	@Column({ type: 'varchar', length: 255 })
	public loser: string;

	@Column({ type: 'int' })
	public scoreWinner: number;

	@Column({ type: 'int' })
	public scoreLoser: number;

	@CreateDateColumn({ type: 'timestamp with time zone' })
	public createdAt!: Date;
}
