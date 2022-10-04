import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MsgDto } from './chan.dto';

@Entity()
export class Chan
{
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({ type: 'varchar', length: 255 })
	public name: string;

	@Column({ type: 'int', array: true, nullable: null })
	public usersId: number[];

	@Column({ type: 'int' })
	public ownerId: number;

	@Column({ type: 'int', array: true, nullable: null })
	public adminsId: number[];

	@Column({ type: 'varchar', length: 16 })
	public type: 'public' | 'private' | 'protected' | 'direct';

	@Column({ type: 'int', nullable: true, default: null })
	public hash?: number;

	@Column({ type: 'jsonb', nullable: true })
	public msg?: MsgDto[];

	@Column({ type: 'int', array: true, nullable: null })
	public bannedId?: number[];

	@Column({ type: 'int', array: true, nullable: null })
	public mutedId?: number[];

	/*
	 * Create and Update Date Columns
	 */

	@CreateDateColumn({ type: 'timestamp' })
	public createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	public updatedAt!: Date;
}
