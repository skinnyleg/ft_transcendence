import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Channel, User, Types, Message, Dm } from '@prisma/client';
import { ValidationError, validate } from "class-validator";
import { Socket } from "socket.io";
import { UserService } from "src/user/user.service";

export interface dmsSide {
	dmId?: string,
	name?: string,
	reciverId?: string,
	lastMsg?: string,
	picture?: string
	dmStatus?: string,
	userStatus?: string
}

export interface dmMessages {
	dmId?: string,
	messageId?: string,
	sender?: string,
	message?: string,
	time?: string,
	self?: string
}

@Injectable()
export class DmOutils {
  
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService
	){}

	async	getDmIdby2User(user1Id: string, user2Id: string)
    {
		const dm = await this.prisma.dm.findFirst({
			where: {
				members: {
					every: {
						id: {
							in: [user1Id, user2Id],
						},
					},
				},
			},
		});
		return dm?.id || null;
    }
    
  	async	validateDtoData(data: any, dtoClass: any)
	{
		const ObjectDto = new dtoClass();
		Object.assign(ObjectDto, data);
		const ValidationError: ValidationError[] = await validate(ObjectDto);
		if (ValidationError.length > 0) {
			throw new BadRequestException('Invalide data');
		}
	}

	async   getUserIdByName(nickname: string): Promise<string | null>
    {
        const user = await this.prisma.user.findUnique({
            where : { nickname },
        });
        if (!user)
            throw new NotFoundException(`${nickname} not found1`);
        return user.id || null;
    }

	async	getBlockedUsers(userId: string)
	{ 
		const  blockedList = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				BlockedBy: true,
				usersBlocked: true
			},
		});
		if (!blockedList)
			throw new NotFoundException('user not found.');
		return [...blockedList.BlockedBy, ...blockedList.usersBlocked] || [];
	}

	isInBlockedList(username: string, blockedList: string[])
	{
		for(const user of blockedList) {
			if (user === username)
				return true;
		}
		return false;
	}

	async	updateDmupdatedAt(dmId: string, updatedAt: Date)
	{
		await this.prisma.dm.update({
			where: { id: dmId },
			data: { updatedAt },
		});
	}

	dateTime2String(datetime: Date)
	{
		const time = datetime.toString().split(' ')[4];
		const tm = time.substring(0, time.lastIndexOf(':'))
		return tm;
	}

	Error(client: Socket, event: string, error: any, msg: any)
	{
		console.error(`error<${event}>: `, error.message);
		if (error instanceof NotFoundException || error instanceof BadRequestException || 
			error instanceof UnauthorizedException || error instanceof ForbiddenException || 
			error instanceof InternalServerErrorException || error instanceof ConflictException) {
			client.emit(`failed`, error.message);
		}
		else {
			client.emit(`failed`, msg);
		}
	}

	async fillDmsBuffer(message: any, nicknameId: string, dmId: string)
	{
		const buffer: dmMessages = {};
		buffer.dmId = dmId;
		buffer.messageId = message.id;
		buffer.sender = await this.userService.getNickById(message.sender.id);
		buffer.self = await this.userService.getNickById(nicknameId);
		buffer.message = message.content;
		buffer.time = this.dateTime2String(message.createdAt);
		return buffer;
	}
}
