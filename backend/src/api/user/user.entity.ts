import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ColumnNumericTransformer
{
	to(data: number): number
	{
		return data;
	}
	from(data: string): number
	{
		return parseFloat(data);
	}
}

@Entity()
export class User
{
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({ type: 'varchar', length: 120 })
	public access_token: string;

	@Column({ type: 'varchar', length: 32, default: "" })
	public twofa: string;

	@Column({ type: 'varchar', length: 255 })
	public name: string;

	@Column({ type: 'varchar', nullable: true, default: "uploads/profileimages/default.png" })
	public pp_path?: string;

	@Column({ type: 'bytea', nullable: true, default: null })
	public pp?: Express.Multer.File;

	@Column({
		type: 'decimal',
		precision: 7,
		scale: 2,
		transformer: new ColumnNumericTransformer(),
		default: 0
	})
	public xp: number;

	@Column({ type: 'int', default: 1000 })
	public elo: number;

	@Column({ type: 'int', default: 0 })
	public win: number;

	@Column({ type: 'int', default: 0 })
	public lose: number;

	@Column({ type: 'int', array: true, nullable: true })
	public friendsId?: number[];

	@Column({ type: 'int', array: true, nullable: true })
	public mutedId?: number[];

	@Column({ type: 'boolean', default: false })
	public isDeleted: boolean;

	/*
	 * Create and Update Date Columns
	 */

	@CreateDateColumn({ type: 'timestamp' })
	public createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	public updatedAt!: Date;
}
