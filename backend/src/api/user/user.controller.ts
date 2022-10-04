import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseInterceptors, StreamableFile } from '@nestjs/common';
import { Auth42Dto, ChooseUsernameDto, UpdateUserDto, UpdateUsersAfterGameDto, UploadDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { createReadStream } from 'graceful-fs';

export const storage = {
	storage: diskStorage({
		destination: './uploads/profileimages',
		filename: (req, file, cb) =>
		{
			cb(null, Date.now() + '_' + file.originalname);
		},
	})
}

@Controller('user')
export class UserController
{
	@Inject(UserService)
	private readonly service: UserService;

	@Get('init')
	public initChan(): Promise<User>
	{
		return this.service.initUser();
	}

	@Get()
	public getUsers(): Promise<User[]>
	{
		return this.service.getUsers();
	}

	@Get('all')
	public getUsersWithDefault(): Promise<User[]>
	{
		return this.service.getUsersWithDefault();
	}

	@Post('auth42')
	public auth42(@Body() data: Auth42Dto): Promise<User>
	{
		return this.service.auth42(data);
	}

	@Get(':id')
	public getUser(@Param('id', ParseIntPipe) id: number): Promise<User>
	{
		return this.service.getUser(id);
	}

	// tmp add user
	@Post('name/:name')
	public tmpCreateUser(@Param('name') name: string)
	{
		return this.service.tmpCreateUser({ name: name });
	}

	@Get('name/:name')
	public tmpGetUser(@Param('name') name: string)
	{
		return this.service.getUserByName(name);
	}

	@Put(':id')
	public updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto)
	{
		return this.service.updateUser(id, data);
	}

	@Put('username/:id')
	public chooseUsername(@Param('id', ParseIntPipe) id: number, @Body() data: ChooseUsernameDto, @Res({ passthrough: true }) res: Response)
	{
		return this.service.chooseUsername(id, data.username, res);
	}

	@Post('match')
	public updateUsersAfterGame(@Body() data: UpdateUsersAfterGameDto)
	{
		return this.service.updateUsersAfterGame(data);
	}

	@Post('pp/:id')
	@UseInterceptors(FileInterceptor('file', storage))
	public async create(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File)
	{
		//console.log("pp/:id", id, file);
		return await this.service.create(file, id, file.filename, file.path);
	}

	@Get('pp/:id')
	public async getProfilePic(@Param('id', ParseIntPipe) id: number): Promise<Express.Multer.File>
	{
		return await this.service.getPP(id);
	}

	@Get('photo/:id')
	public async getUserProfilePhoto(@Param('id', ParseIntPipe) id: number,
		@Res({ passthrough: true }) res: Response
	): Promise<StreamableFile>
	{

		res.set({ 'Content-Type': 'image/jpeg' });

		const img = await this.service.fileStream(id);

		const file = createReadStream(img);
		return new StreamableFile(file);
	}
}

